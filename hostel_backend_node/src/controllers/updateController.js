import { createUpdate, getAllUpdates } from "../services/updateService.js";

// Post Page updates

export const postUpdate = async (req, res) => {
  try {
    const { title, caption } = req.body;
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    if (!title || !caption) {
      return res.status(400).json({ message: "Title and caption required" });
    }

    const response = await createUpdate({ title, caption, imageUrl });
    res.status(201).json(response);
  } catch {
    res.status(500).json({ message: "Failed to post update" });
  }
};

export const fetchUpdates = async (req, res) => {
  try {
    const updates = await getAllUpdates();
    res.json(updates);
  } catch {
    res.status(500).json({ message: "Failed to fetch updates" });
  }
};
