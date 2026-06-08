import express from "express";
const router = express.Router();
import Thought from "../models/Thought.js";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";

// @route           GET /api/thoughts
// @description     Get all thoughts
// @access          Public
// @query           _limit (optional limit for thoughts returned)
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit);
    const query = Thought.find().sort({ createdAt: -1 });

    if (!isNaN(limit)) {
      query.limit(limit);
    }

    const thoughts = await query.exec();
    res.json(thoughts);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route           GET /api/thoughts/:id
// @description     Get single thought
// @access          Public
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Thought Not Found");
    }

    const thought = await Thought.findById(id);

    if (!thought) {
      res.status(404);
      throw new Error("Thought Not Found");
    }
    res.json(thought);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route           POST /api/thoughts
// @description     Create new thought
// @access          Public
router.post("/", protect, async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("Title, summary and description are required");
    }

    const newThought = new Thought({
      title,
      summary,
      description,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
            ? tags
            : [],
      user: req.user.id,
    });

    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route           DELETE /api/thoughts/:id
// @description     Delete thought
// @access          Public
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Thought Not Found");
    }

    const thought = await Thought.findById(id);

    if (!thought) {
      res.status(404);
      throw new Error("Thought not found");
    }

    // Check if user owns thought
    if (thought.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this thought");
    }

    await thought.deleteOne();

    res.json({ message: "Thought deleted successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route           PUT /api/thoughts/:id
// @description     Update thought
// @access          Public
router.put("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Thought Not Found");
    }

    const thought = await Thought.findById(id);

    if (!thought) {
      res.status(404);
      throw new Error("Thought not found");
    }

    // Check if user owns thought
    if (thought.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this thought");
    }

    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("Title, summary and description are required");
    }

    thought.title = title;
    thought.summary = summary;
    thought.description = description;
    thought.tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

    const updatedThought = await thought.save();

    res.json(updatedThought);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
