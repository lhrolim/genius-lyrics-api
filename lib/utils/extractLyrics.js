const axios = require("axios");
const cheerio = require("cheerio-without-node-native");

const scrapeLyrics = async (url, options) => {
  try {
    let { apiKey, authHeader = false } = options;
    const headers = {
      Authorization: "Bearer " + apiKey,
    };
    let { data } = await axios.get(url);

    const $ = cheerio.load(data);

    let lyrics = "";

    $("div[data-lyrics-container]").each((i, elem) => {
      const snippet = $(elem)
        .html()
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/<[^>]+>/g, "");

      lyrics += snippet.trim() + "\n\n";
    });

    if (!lyrics) {
      console.log("No lyrics found.");
      return null;
    }

    return lyrics.trim();
  } catch (error) {
    console.error("Error while scraping:", error.message);
    return null;
  }
};

/**
 * @param {string} url - Genius URL
 */
module.exports = async function (url, options) {
  try {
    const lyrics = await scrapeLyrics(url, options);
    return lyrics;
  } catch (e) {
    throw e;
  }
};
