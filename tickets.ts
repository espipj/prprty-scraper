import puppeteer, { Page } from 'puppeteer'
import { wimData } from './types'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

const WIM_LOGIN = 'https://www.wimbledon.com/en_GB/mywimbledon/login'
const WIM_URL = (wim_id: number) =>
  `https://ticketsale.wimbledon.com/secured/selection/event/seat?perfId=${wim_id}`
const initialID = 101760903220

const userName = process.env.WB_USER || ''
const pswd = process.env.WB_PSWD || ''

export const navWim = async (bot: Telegraf<Context<Update>>, id: string) => {
  if (!userName || !pswd) return new Error('No login info detected')
  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch({
    // headless: false,
    args: [
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    ],
    defaultViewport: { height: 700, width: 1200 },
  })
  const page = await browser.newPage()

  /* Go to the IMDB Movie page and wait for it to load */
  //   await page.goto(WIM_URL(101760903220), { waitUntil: 'networkidle0' })
  await page.goto(WIM_LOGIN, {
    waitUntil: 'networkidle0',
  })
  // Fill in the login form
  await page.type('#loginID', userName)
  await page.type('#password', pswd)
  await page.focus('#password')
  await page.keyboard.press('Enter')
  await page.waitForNavigation()

  for (let i = initialID; i < 101760903266; i++) {
    const resData = await visitDay(page, i)
    if (resData) {
      sendToTelegram(resData, id, bot)
    }
  }
  browser.close()
}

const visitDay = async (page: Page, id: number): Promise<wimData | null> => {
  await page.goto(WIM_URL(id), {
    waitUntil: 'networkidle0',
  })
  await page.waitForSelector('.semantic-no-styling-no-display.title')
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

const sendToTelegram = (
  resData: wimData,
  chatId: string,
  bot: Telegraf<Context<Update>>
) => {
  console.log(resData)
  bot.telegram.sendMessage(
    chatId,
    `Tickets available!\n${resData.title}\nDate: ${resData.day}\nBuy them [here](${resData.url})`,
    { parse_mode: 'Markdown' }
  )
}