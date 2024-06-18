require('dotenv').config()
import { Context, NarrowedContext, Telegraf } from 'telegraf'
import { telegrafThrottler } from 'telegraf-throttler'
import { load } from 'cheerio'
import axios from 'axios'
import { Property, SearchResult } from './types'
import { Update, Message } from 'telegraf/typings/core/types/typegram'
import { navWim } from './tickets'

const bot = new Telegraf(process.env.TG_BOT_TKN || '')
const throttler = telegrafThrottler()
bot.use(throttler)
const appScriptId = process.env.APPS_SCRIPT_ID

const getAdData = (id: string | number) => {
  return axios
    .get(`https://www.rightmove.co.uk/properties/${id}#/?channel=RES_BUY`, {
      responseType: 'document',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/117.0',
      },
    })
    .then((response): Property => {
      const html = response.data
      const $ = load(html)

      const scriptData = $('body > script:nth-child(13)').text()
      const idxRemove = scriptData.indexOf('window.adInfo')
      const propertyData: Property = JSON.parse(scriptData.slice(25, idxRemove))
      return propertyData
    })
}

const scrapPropertyData = async (code: number | string) => {
  const propertyData = await getAdData(code)
  if (!propertyData) return null
  let textMessage =
    `${propertyData.propertyData.address.displayAddress} \n` +
    `${propertyData.propertyData.prices.primaryPrice}\n` +
    `Key Features:\n- ${propertyData.propertyData.keyFeatures.join('\n- ')}` +
    `Tenure: ${propertyData.propertyData.tenure.tenureType}\n` +
    `[FULL AD](https://www.rightmove.co.uk/properties/${
      propertyData.propertyData.id
    })   ${'`'}/pp ${propertyData.propertyData.id}${'`'}`
  const imagesArray = propertyData.propertyData.images.map((v, idx) => ({
    media: v.url,
    caption: idx === 0 ? textMessage : null,
    parse_mode: 'Markdown',
    type: 'photo',
  }))
  imagesArray.push({
    media: propertyData.propertyData.staticMapImgUrls.staticMapImgUrlMobile,
    type: 'photo',
    caption: null,
    parse_mode: 'Markdown',
  })
  const location = {
    latitude: propertyData.propertyData.location.latitude,
    longitude: propertyData.propertyData.location.longitude,
  }

  return { textMessage, location, imagesArray }
}

bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.command(['property', 'pp'], async (ctx) => {
  console.log(ctx.message.text)
  const code = ctx.message.text.split(' ')[1]

  if (!code) {
    ctx.reply('No ID provided')
    return
  }
  ctx.reply(`Fetching data for ${code}...`)
  const propertyData = await getAdData(code)
  if (!propertyData) {
    ctx.reply('Not found')
    return
  }

  ctx.reply('Data downloaded')
  let imagesArray = propertyData.propertyData.images.map((v) => ({
    media: v.url,
    caption: v.caption,
    type: 'photo',
  }))
  imagesArray.push({
    media: propertyData.propertyData.staticMapImgUrls.staticMapImgUrlMobile,
    caption: 'Area',
    type: 'photo',
  })
  ctx.sendMessage(
    `${propertyData.propertyData.address.displayAddress} \n${propertyData.propertyData.prices.primaryPrice}`
  )
  ctx.sendMediaGroup(
    /* @ts-ignore */
    imagesArray.slice(0, 10)
  )
  ctx.sendLocation(
    propertyData.propertyData.location.latitude,
    propertyData.propertyData.location.longitude
  )
})

bot.command(['ll', 'lastlistings'], async (ctx) => {
  scrapFromMessage({ ctx })
})

type ctxType = NarrowedContext<
  Context<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage
    update_id: number
  }
>

const scrapFromMessage = async ({ ctx }: { ctx: ctxType }) => {
  const { data } = await axios.get(
    `https://script.google.com/macros/s/${appScriptId}/exec?userId=${ctx.from.id}`
  )
  let pages = 1
  for (let p = 0; p < 1; p++) {
    const srchURL = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=USERDEFINEDAREA%5E%7B%22id%22%3A%226270618%22%7D&minBedrooms=2&maxPrice=350000&index=${
      p * 24
    }`
    console.log(srchURL)

    try {
      const response = await axios.get(srchURL)

      const html = response.data
      const $ = load(html)

      const scriptData = $('body > script:nth-child(11)').text()
      const propertyData: SearchResult = JSON.parse(
        scriptData.slice(19, scriptData.length)
      )
      pages = propertyData.pagination.total
      //propertyData.properties.length
      for (let i = 0; i < propertyData.properties.length; i++) {
        if (data[propertyData.properties[i].id]) {
          console.log('Was already here: ' + propertyData.properties[i].id)
          continue
        }
        const ppty = await scrapPropertyData(propertyData.properties[i].id)
        if (!ppty) continue
        console.log(ppty.textMessage)
        console.log({ id: propertyData.properties[i].id, userId: ctx.from.id })

        console.log(ppty)
        await ctx.replyWithMediaGroup(
          /* @ts-ignore */
          ppty?.imagesArray.slice(0, 10)
        )

        await ctx.sendLocation(ppty?.location.latitude, ppty.location.longitude)
        axios.post(
          `https://script.google.com/macros/s/${appScriptId}/exec`,
          {
            id: propertyData.properties[i].id.toString(),
            userId: ctx.from.id.toString(),
          },
          { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        )
      }
    } catch (e) {
      console.log(e)
    }
  }
}

const scrapFromId = async ({ userId }: { userId: string }) => {
  const { data } = await axios.get(
    `https://script.google.com/macros/s/${appScriptId}/exec?userId=${userId}`
  )
  let pages = 1
  let sent = false
  for (let p = 0; p < pages && !sent; p++) {
    const srchURL = `https://www.rightmove.co.uk/property-for-sale/find.html`

    try {
      const response = await axios.get(srchURL, {
        params: {
          locationIdentifier: `USERDEFINEDAREA^{"id":"8476459"}`,
          minBedrooms: 2,
          maxPrice: 350000,
          index: p * 24,
          sortType: 6,
        },
      })

      const html = response.data
      const $ = load(html)
      const scriptData = $('body > script:nth-child(12)').text()
      const propertyData: SearchResult = JSON.parse(
        scriptData.slice(19, scriptData.length)
      )
      pages = propertyData.pagination.total
      //propertyData.properties.length
      for (let i = 0; i < propertyData.properties.length; i++) {
        if (data[propertyData.properties[i].id]) {
          console.log('Was already here: ' + propertyData.properties[i].id)
          continue
        }
        const ppty = await scrapPropertyData(propertyData.properties[i].id)
        if (!ppty) continue
        console.log(ppty.textMessage)
        console.log({ id: propertyData.properties[i].id, userId: userId })

        console.log(ppty)
        await bot.telegram.sendMediaGroup(
          userId,
          /* @ts-ignore */
          ppty?.imagesArray.slice(0, 10)
        )
        await new Promise((resolve) => setTimeout(resolve, 50000))
        await bot.telegram.sendLocation(
          userId,
          ppty?.location.latitude,
          ppty.location.longitude
        )
        axios.post(
          `https://script.google.com/macros/s/${appScriptId}/exec`,
          {
            id: propertyData.properties[i].id.toString(),
            userId: userId,
          },
          { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        )
        sent = true
        break
      }
    } catch (e) {
      throw e
    }
  }
}
console.log(process.argv)
if (process.argv.length < 3) {
  bot.launch()
}

if (process.argv.length === 3) {
  scrapFromId({ userId: process.argv[2] })
}
if (process.argv.length === 4) {
  navWim(bot, process.argv[2])
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
