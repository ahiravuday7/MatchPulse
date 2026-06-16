// Store user's favorite teams or leagues
import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["team", "league"],
      required: true,
    },

    externalId: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
    },

    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// This prevents duplicate favorites. So same user cannot favorite the same team twice.
favoriteSchema.index({ userId: 1, type: 1, externalId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
