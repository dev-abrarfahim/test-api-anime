import { extractStreamingInfo } from "../extractors/streamInfo.extractor.js";

export const getStreamInfo = async (req, res, fallback = false) => {
  try {
    const { id: input, server, type } = req.query ?? {};

    if (!input || typeof input !== "string") {
      return { error: "Missing or invalid 'id' query parameter" };
    }

    const match = input.match(/[?&]ep=(\d+)/);
    if (!match) {
      return { error: "Invalid URL format: missing 'ep' parameter" };
    }

    const finalId = Number.parseInt(match[1], 10);
    if (Number.isNaN(finalId)) {
      return { error: "Invalid episode id" };
    }

    const streamingInfo = await extractStreamingInfo(
      finalId,
      server,
      type,
      fallback
    );

    if (!streamingInfo) {
      return { error: "No streaming info found" };
    }

    return streamingInfo;
  } catch (error) {
    console.error("getStreamInfo error:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
