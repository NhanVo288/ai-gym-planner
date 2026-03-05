import { Router, type Request, type Response } from "express";

export const profileRoute = Router();

profileRoute.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, ...profileData } = req.body;
    if (!userId) {
      return res.status(500).json({ message: "UserId is required" });
    }
    const {
      goal,
      experience,
      daysPerWeek,
      sessionLength,
      equipment,
      injuries,
      preferredSplit,
    } = profileData;

    if (
      !goal ||
      !experience ||
      !daysPerWeek ||
      !sessionLength ||
      !equipment ||
      !preferredSplit
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Failed to save profile" });
  }
});
