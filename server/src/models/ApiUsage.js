import mongoose from "mongoose";

const apiUsageSchema = new mongoose.Schema(
  {
    dateKey: {
      type: String,
      required: true,
      unique: true,
    },

    totalRequests: {
      type: Number,
      default: 0,
      min: 0,
    },

    successfulRequests: {
      type: Number,
      default: 0,
      min: 0,
    },

    failedRequests: {
      type: Number,
      default: 0,
      min: 0,
    },

    endpoints: {
      type: Map,
      of: Number,
      default: {},
    },

    statusCodes: {
      type: Map,
      of: Number,
      default: {},
    },

    lastRequestAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const ApiUsage = mongoose.model("ApiUsage", apiUsageSchema);

export default ApiUsage;
