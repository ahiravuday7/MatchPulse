import mongoose from "mongoose";

const playerIndexSchema = new mongoose.Schema(
  {
    externalId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    searchName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    age: {
      type: Number,
      default: null,
    },

    number: {
      type: Number,
      default: null,
    },

    position: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    currentTeam: {
      id: {
        type: Number,
        default: null,
      },
      name: {
        type: String,
        default: "",
      },
      logo: {
        type: String,
        default: "",
      },
    },

    sourceTeams: [
      {
        id: Number,
        name: String,
        logo: String,
      },
    ],

    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

playerIndexSchema.index({
  searchName: "text",
  "currentTeam.name": "text",
});

const PlayerIndex = mongoose.model("PlayerIndex", playerIndexSchema);

export default PlayerIndex;
