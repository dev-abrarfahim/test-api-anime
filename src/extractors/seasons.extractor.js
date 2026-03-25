import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

async function extractSeasons(id) {
  try {
    if (!id) return [];

    const { data } = await axios.get(`https://${v1_base_url}/watch/${id}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: `https://${v1_base_url}/`,
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    const seasonLinks = $(".anis-watch > .other-season > .inner > .os-list > a");

    if (!seasonLinks.length) {
      return [];
    }

    const seasons = seasonLinks
      .map((index, element) => {
        const el = $(element);
        const href = el.attr("href") || "";
        const style = el.find(".season-poster").attr("style") || "";

        const cleanId = href
          .replace(/^\/+/, "")
          .replace(/^watch\//, "")
          .replace(/^details\//, "")
          .replace(/\?.*$/, "")
          .trim();

        const dataIdMatch = href.match(/-(\d+)(?:\?|$)/);
        const parsedDataId = dataIdMatch ? parseInt(dataIdMatch[1], 10) : null;

        const posterMatch = style.match(/url\(["']?(.*?)["']?\)/);
        const seasonPoster = posterMatch?.[1] || "";

        const season = el.find(".title").text().trim();
        const title = (el.attr("title") || season).trim();

        if (!cleanId) return null;

        return {
          id: cleanId,
          data_number: index + 1,
          data_id: Number.isNaN(parsedDataId) ? null : parsedDataId,
          season,
          title,
          season_poster: seasonPoster,
        };
      })
      .get()
      .filter(Boolean);

    return seasons;
  } catch (e) {
    console.error("extractSeasons error:", e.message);
    return [];
  }
}

export default extractSeasons;
