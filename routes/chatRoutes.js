const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const hotelContext = require("../data/hotelContext.js");

// import express from "express";
// import dotenv from "dotenv";
// import OpenAI from "openai";
// import hotelContext from "../data/hotelContext.js";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const messages = [
      { role: "system", content: hotelContext },
      ...history,
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // or any chat model available to you
      messages,
      temperature: 0.4,
    });

    const reply =
      completion.choices[0]?.message?.content || "Sorry, no response.";

    res.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});



module.exports = router;