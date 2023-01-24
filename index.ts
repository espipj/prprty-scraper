require("dotenv").config();
import { Telegraf } from "telegraf";
import { load } from "cheerio";
import axios from "axios";
import { Property } from "./types";

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
      console.log("response");
      return propertyData;
    });
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

bot.launch();
