const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    description: { type: String, default: "" },
    status: { type: String, enum: ["open", "closed"], default: "open" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);