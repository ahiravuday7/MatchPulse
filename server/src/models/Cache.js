// Store API response data temporarily
import mongoose from "mongoose";

const cacheSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      index: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    lastFetchedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Cache = mongoose.model("Cache", cacheSchema);

export default Cache;
