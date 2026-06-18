import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["team", "league", "player"],
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
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    meta: {
      teamId: {
        type: Number,
        default: null,
      },
      teamName: {
        type: String,
        default: "",
      },
      position: {
        type: String,
        default: "",
      },
      nationality: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true },
);

// This prevents duplicate favorites. So same user cannot favorite the same team twice.
favoriteSchema.index(
  {
    user: 1,
    type: 1,
    externalId: 1,
  },
  {
    unique: true,
  },
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;

// Store user's favorite teams or leagues
