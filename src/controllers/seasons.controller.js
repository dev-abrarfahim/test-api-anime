import extractSeasons from "../extractors/seasons.extractor.js";

export const getSeasons = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const seasons = await extractSeasons(id);

    return res.status(200).json({
      success: true,
      seasons,
    });
  } catch (e) {
    console.error("getSeasons error:", e.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching seasons",
    });
  }
};
