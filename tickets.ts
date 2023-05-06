import puppeteer, { Page } from 'puppeteer'
const WIM_URL = (wim_id: number) =>
  `https://ticketsale.wimbledon.com/secured/selection/event/seat?perfId=${wim_id}`
const initialID = 101760903220

export const navWim = async () => {
  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    ],
    defaultViewport: { height: 700, width: 1200 },
  })
  const page = await browser.newPage()

  /* Go to the IMDB Movie page and wait for it to load */
  //   await page.goto(WIM_URL(101760903220), { waitUntil: 'networkidle0' })
  await page.goto('https://www.wimbledon.com/en_GB/mywimbledon/login', {
    waitUntil: 'networkidle0',
  })
  // Fill in the login form
  await page.type('#loginID', '')
  await page.type('#password', '')
  await page.focus('#password')
  await page.keyboard.press('Enter')
  await page.waitForNavigation()

  for (let i = 101760903220; i < 101760903266; i++) {
    console.log(await visitDay(page, i))
  }
}

const visitDay = async (page: Page, id: number) => {
  console.log(id)
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
