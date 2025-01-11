const axios = require('axios');
const cheerio = require('cheerio-without-node-native');


const scrapeLyrics = async (url) => {
  try {
    const { data } = await axios.get(url);

    const $ = load(data);

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
module.exports = async function (url) {
  try {
    let { data } = await scrapeLyrics(url);
    const $ = cheerio.load(data);
    let lyrics = $('div[class="lyrics"]').text().trim();
    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }
    if (!lyrics) return null;
    return lyrics.trim();
  } catch (e) {
    throw e;
  }
};
