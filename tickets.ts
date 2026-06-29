import puppeteer, { Page } from 'puppeteer'
import { wimData } from './types'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { createInterface } from 'node:readline/promises'
import path from 'path'

const WIM_LOGIN = 'https://www.wimbledon.com/en_GB/mywimbledon/login'
const HOME_TICKETS = 'https://ticketsale.wimbledon.com/secured/content#'
const WIM_URL = (wim_id: number) =>
  `https://ticketsale.wimbledon.com/secured/selection/event/seat?perfId=${wim_id}`
const initialID = 101760903220
const NAVIGATION_TIMEOUT_MS = 90_000
const USER_DATA_DIR = path.resolve(process.cwd(), '.puppeteer-profile')
const SHORT_WAIT_MS = 5_000
const HUMAN_SETTLE_MS = 2_000

const userName = process.env.WB_USER || ''
const pswd = process.env.WB_PSWD || ''

export const navWim = async (bot: Telegraf<Context<Update>>, id: string) => {
  if (!userName || !pswd) return new Error('No login info detected')
  console.log('[wim] starting navigation')
  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: USER_DATA_DIR,
    args: [
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      '--disable-blink-features=AutomationControlled',
    ],
    defaultViewport: null,
    ignoreDefaultArgs: ['--enable-automation'],
  })
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS)
  page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS)

  try {
    /* Go to the tickets home page to check if already logged in */
    console.log('[wim] checking if already logged in')
    await page.goto(HOME_TICKETS, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT_MS,
    })

    // Check if we are on the login page or the tickets page
    // If the URL contains "login", we need to log in
    const currentUrl = page.url()
    const isLoggedIn = !currentUrl.includes('login')

    if (!isLoggedIn) {
      console.log('[wim] not logged in, proceeding with login')
      // If not logged in, go to login page
      await page.goto(WIM_LOGIN, {
        waitUntil: 'domcontentloaded',
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      console.log('[wim] login page loaded, dismissing cookies if present')
      await dismissCookies(page)
      console.log('[wim] opening login form')
      await openLoginForm(page)
      console.log('[wim] login form ready')
      await humanCheckpoint(
        'Solve any CAPTCHA or anti-bot challenge in the browser, then press Enter to continue'
      )
      // Fill in the login form
      console.log('[wim] filling credentials')
      await fillInputValue(page, '#loginID', userName)
      await fillInputValue(page, '#password', pswd)
      await verifyInputValue(page, '#loginID', userName)
      await verifyInputValue(page, '#password', pswd)
      await page.waitForTimeout(HUMAN_SETTLE_MS)
      console.log('[wim] credentials present in fields')
      await page.focus('#password')
      console.log('[wim] submitting login form')
      await page.keyboard.press('Enter')
      console.log('[wim] waiting for post-login navigation')
      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: NAVIGATION_TIMEOUT_MS })
      console.log('[wim] login submitted, opening tickets home')
      await page.goto(HOME_TICKETS, {
        waitUntil: 'domcontentloaded',
        timeout: NAVIGATION_TIMEOUT_MS,
      })
    } else {
      console.log('[wim] already logged in')
    }

    console.log('[wim] tickets home loaded')

    console.log('[wim] waiting for ticket cards')
    await page.waitForSelector('.stx-ProductBox', { timeout: NAVIGATION_TIMEOUT_MS })
    console.log('[wim] ticket cards found')
    const a = await page.$$('.stx-ProductCardMainContent a')
    console.log(`[wim] found ${a.length} ticket links`)

    const links = a.map(async (a) => {
      return await a.evaluate((a) => a.href)
    })
    for (let idx = 0; idx < links.length; idx++) {
      console.log(`[wim] checking link ${idx + 1}/${links.length}`)
      const resData = await visitDayFromIndex(page, await links[idx])
      console.log({ resData })
      if (resData) {
        console.log('[wim] availability found, sending telegram message')
        await sendToTelegram(resData, id, bot)
      }
    }
  } catch (error) {
    console.log('[wim] flow failed')
    throw error
  } finally {
    console.log('[wim] closing browser')
    await browser.close()
  }
}

const visitDay = async (page: Page, id: number): Promise<wimData | null> => {
  await page.goto(WIM_URL(id), {
    waitUntil: 'domcontentloaded',
    timeout: NAVIGATION_TIMEOUT_MS,
  })
  await page.waitForSelector('.semantic-no-styling-no-display.title', {
    timeout: NAVIGATION_TIMEOUT_MS,
  })
  const unavSel = await page.$$('.category_unavailable_overlay')
  if (unavSel.length >= 2 && id < 101760903248) {
    return null
  }
  if (unavSel.length > 1) {
    return null
  }
  const title = await page.$('.semantic-no-styling-no-display.title')
  const day = await page.$('.unique .day')
  return {
    title: (await title?.evaluate((el) => el.textContent))
      ?.replace(/[\n\t]/g, '')
      .trim(),
    day: (await day?.evaluate((el) => el.textContent))
      ?.replace(/[\n\t]/g, '')
      .trim(),
    url: WIM_URL(id),
  }
}
const courtNames = ['Centre', 'No.1']
const visitDayFromIndex = async (
  page: Page,
  url: string
): Promise<wimData | null> => {
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: NAVIGATION_TIMEOUT_MS,
  })

  try {
    await page.waitForSelector('.category_unavailable_overlay', {
      timeout: 1000,
    })
    console.log('found selector sold out')
  } catch (error) {
    console.log("Couldn't find sold out selector")
  }
  const title = await page.$('.semantic-no-styling-no-display.title')
  const titleText = (await title?.evaluate((el) => el.textContent))
    ?.replace(/[\n\t]/g, '')
    .trim()
  const unavSel = await page.$$('.category_unavailable_overlay')
  if (
    (unavSel.length >= 2 &&
      courtNames.some((value) => titleText?.includes(value))) ||
    unavSel.length >= 1
  ) {
    return null
  }
  const day = await page.$('.unique .day')
  return {
    title: titleText,
    day: (await day?.evaluate((el) => el.textContent))
      ?.replace(/[\n\t]/g, '')
      .trim(),
    url,
  }
}

const sendToTelegram = async (
  resData: wimData,
  chatId: string,
  bot: Telegraf<Context<Update>>
) => {
  console.log(resData)
  await bot.telegram.sendMessage(
    chatId,
    `Tickets available!\n${resData.title}\nDate: ${resData.day}\nBuy them [here](${resData.url})`,
    { parse_mode: 'Markdown' }
  )
}

const dismissCookies = async (page: Page) => {
  console.log('[wim] looking for cookie banner')
  try {
    const button = await page.waitForXPath(
      "//button[@id='onetrust-reject-all-handler']",
      { timeout: SHORT_WAIT_MS }
    )

    if (!button) {
      console.log('[wim] cookie banner not found')
      return
    }

    console.log('[wim] clicking cookie reject button')
    await humanClick(page, '#onetrust-reject-all-handler')
    await page.waitForTimeout(1000)
    console.log('[wim] cookie banner dismissed')
  } catch (error) {
    console.log('[wim] cookie banner not found')
  }
}

const openLoginForm = async (page: Page) => {
  console.log('[wim] waiting for Join / Login button')
  await page.waitForXPath(
    "//button[.//span[contains(normalize-space(.), 'Join / Login')]]",
    { timeout: SHORT_WAIT_MS }
  )

  console.log('[wim] locating Join / Login button')
  // Using a more specific selector if possible, or fallback to xpath
  // For now, let's assume we can find it by text content if the xpath is too generic
  // But since we need a selector for humanClick, let's try to get a better selector
  // If the button has an id or class, use that. Otherwise, we might need to stick with xpath
  // or find another way.

  // Let's try to find the button using a CSS selector if possible, or use the xpath result
  // For humanClick, we need a CSS selector. Let's try to find one.
  // If not, we can modify humanClick to accept xpath or ElementHandle.

  // Let's assume for now we can find it by a class or id. If not, we'll adjust.
  // The xpath is: //button[.//span[contains(normalize-space(.), 'Join / Login')]]
  // This is complex for CSS. Let's try to find a simpler selector.

  // For now, let's just use the xpath result and click it directly, but with human-like delays
  const [button] = await page.$x(
    "//button[.//span[contains(normalize-space(.), 'Join / Login')]]"
  )

  if (!button) {
    throw new Error('Could not find Join / Login button')
  }

  console.log('[wim] clicking Join / Login')
  // await button.click() // Replace this

  // Get bounding box of the element
  const box = await button.boundingBox()
  if (!box) throw new Error('Could not get bounding box for Join / Login button')

  const x = box.x + box.width / 2 + (Math.random() * 10 - 5)
  const y = box.y + box.height / 2 + (Math.random() * 10 - 5)

  await page.mouse.move(x, y, { steps: Math.floor(Math.random() * 10) + 5 })
  await sleep(Math.random() * 100 + 50)
  await page.mouse.down()
  await sleep(Math.random() * 50 + 20)
  await page.mouse.up()
  await sleep(Math.random() * 100 + 50)

  console.log('[wim] waiting for login form fields')
  await page.waitForSelector('#loginID', { timeout: NAVIGATION_TIMEOUT_MS })
  await page.waitForTimeout(1500)
  console.log('[wim] login form fields are visible')
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const humanType = async (page: Page, selector: string, text: string) => {
  await page.focus(selector)
  for (const char of text) {
    await page.keyboard.type(char, { delay: Math.random() * 100 + 50 })
    await sleep(Math.random() * 50 + 20)
  }
}

const fillInputValue = async (
  page: Page,
  selector: string,
  value: string
) => {
  await humanType(page, selector, value)
}

const verifyInputValue = async (
  page: Page,
  selector: string,
  expectedValue: string
) => {
  const startedAt = Date.now()

  while (Date.now() - startedAt < SHORT_WAIT_MS) {
    const currentValue = await page.$eval(
      selector,
      (el: any) => el.value || ''
    )

    console.log(
      `[wim] ${selector} length=${currentValue.length} expected=${expectedValue.length}`
    )

    if (currentValue === expectedValue) {
      return
    }

    await page.waitForTimeout(250)
  }

  throw new Error(`Timed out waiting for ${selector} to reach the expected value`)
}

const humanCheckpoint = async (message: string) => {
  const input = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    await input.question(`\n[wim] ${message}\n`)
  } finally {
    input.close()
  }
}

const humanClick = async (page: Page, selector: string) => {
  const element = await page.$(selector)
  if (!element) throw new Error(`Element not found: ${selector}`)
  const box = await element.boundingBox()
  if (!box) throw new Error(`Could not get bounding box for: ${selector}`)

  // Add some randomness to the click position
  const x = box.x + box.width / 2 + (Math.random() * 10 - 5)
  const y = box.y + box.height / 2 + (Math.random() * 10 - 5)

  await page.mouse.move(x, y, { steps: Math.floor(Math.random() * 10) + 5 })
  await sleep(Math.random() * 100 + 50)
  await page.mouse.down()
  await sleep(Math.random() * 50 + 20)
  await page.mouse.up()
  await sleep(Math.random() * 100 + 50)
}
