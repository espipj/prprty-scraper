require("dotenv").config();
import { Context, NarrowedContext, Telegraf } from "telegraf";
import { load } from "cheerio";
import axios from "axios";
import { Property, SearchResult } from "./types";
import { Update, Message } from "telegraf/typings/core/types/typegram";

const bot = new Telegraf(process.env.TG_BOT_TKN || "");
const chatId = process.env.TG_CHAT || "";

const getAdData = (id: string | number) => {
  return axios
    .get(`https://www.rightmove.co.uk/properties/${id}#/`)
    .then((response): Property => {
      const html = response.data;
      const $ = load(html);

      const scriptData = $("body > script:nth-child(12)").text();
      const propertyData: Property = JSON.parse(
        scriptData.slice(25, scriptData.length)
      );
      return propertyData;
    })
    .catch((e) => console.log(e));
};

const scrapPropertyData = async (code: number | string) => {
  const propertyData = await getAdData(code);
  if (!propertyData) return null;
  const textMessage = `${propertyData.propertyData.address.displayAddress} \n${propertyData.propertyData.prices.primaryPrice}`;
  const imagesArray = propertyData.propertyData.images.map((v) => ({
    media: v.url,
    caption: v.caption,
    type: "photo",
  }));
  imagesArray.push({
    media: propertyData.propertyData.staticMapImgUrls.staticMapImgUrlMobile,
    caption: "Area",
    type: "photo",
  });
  const location = {
    latitude: propertyData.propertyData.location.latitude,
    longitude: propertyData.propertyData.location.longitude,
  };

  return { textMessage, location, imagesArray };
};

bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.command(["property", "pp"], async (ctx) => {
  console.log(ctx.message.text);
  const code = ctx.message.text.split(" ")[1];

  if (!code) {
    ctx.reply("No ID provided");
    return;
  }
  ctx.reply(`Fetching data for ${code}...`);
  const propertyData = await getAdData(code);
  if (!propertyData) {
    ctx.reply("Not found");
    return;
  }

  ctx.reply("Data downloaded");
  let imagesArray = propertyData.propertyData.images.map((v) => ({
    media: v.url,
    caption: v.caption,
    type: "photo",
  }));
  imagesArray.push({
    media: propertyData.propertyData.staticMapImgUrls.staticMapImgUrlMobile,
    caption: "Area",
    type: "photo",
  });
  ctx.sendMessage(
    `${propertyData.propertyData.address.displayAddress} \n${propertyData.propertyData.prices.primaryPrice}`
  );
  ctx.sendMediaGroup(
    /* @ts-ignore */
    imagesArray.slice(0, 10)
  );
  ctx.sendLocation(
    propertyData.propertyData.location.latitude,
    propertyData.propertyData.location.longitude
  );
});

bot.command(["ll", "lastlistings"], async (ctx) => {
  ctx.reply("Hello");
  scrap(ctx);
});

type ctxType = NarrowedContext<
  Context<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;
const scrap = async (ctx: ctxType) => {
  let pages = 1;
  for (let p = 0; p < pages; p++) {
    const srchURL = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=USERDEFINEDAREA%5E%7B%22id%22%3A%226270618%22%7D&minBedrooms=2&maxPrice=350000&index=${
      p * 24
    }`;
    console.log(srchURL);

    try {
      const response = await axios.get(srchURL);

      const html = response.data;
      const $ = load(html);

      console.log(response.status);
      const scriptData = $("body > script:nth-child(11)").text();
      const propertyData: SearchResult = JSON.parse(
        scriptData.slice(19, scriptData.length)
      );
      pages = propertyData.pagination.total;

      for (let i = 0; i < propertyData.properties.length; i++) {
        const ppty = await scrapPropertyData(propertyData.properties[i].id);
        if (!ppty) continue;
        console.log(ppty.textMessage);
        await ctx.sendMessage(ppty?.textMessage);
        await ctx.sendMediaGroup(
          /* @ts-ignore */
          ppty?.imagesArray.slice(0, 10)
        );
        await ctx.sendLocation(
          ppty?.location.latitude,
          ppty.location.longitude
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
};

scrap({} as any);

// bot.launch();
