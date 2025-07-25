import mongoose, { Schema, model, models } from "mongoose";
import { IVideoHistory } from "../types/video-types";
import { VideoStatus } from "../types/video-enums";

const videoHistorySchema = new Schema<IVideoHistory>(
  {
    videoId: {
      type: String,
      required: [true, "Video ID is required"],
      index: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(VideoStatus),
      required: true,
    },
    processingDetails: {
      startTime: {
        type: Date,
        default: Date.now,
      },
      endTime: Date,
      duration: Number,
      error: String,
      progress: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    metadata: {
      inputFormat: String,
      outputFormat: String,
      inputSize: Number,
      outputSize: Number,
      effects: [String],
    },
    isSuccess: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
videoHistorySchema.index({ videoId: 1, createdAt: -1 });
videoHistorySchema.index({ userId: 1, createdAt: -1 });
videoHistorySchema.index({ action: 1, status: 1 });

// Methods
videoHistorySchema.methods.markComplete = async function (
  success: boolean,
  error?: string
) {
  this.processingDetails.endTime = new Date();
  this.processingDetails.duration =
    this.processingDetails.endTime.getTime() -
    this.processingDetails.startTime.getTime();
  this.isSuccess = success;

  if (error) {
    this.processingDetails.error = error;
  }

  await this.save();
};

videoHistorySchema.methods.updateProgress = async function (progress: number) {
  this.processingDetails.progress = progress;
  await this.save();
};

// Statics
videoHistorySchema.statics.findByVideo = function (videoId: string) {
  return this.find({ videoId }).sort({ createdAt: -1 });
};

videoHistorySchema.statics.findByUser = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

videoHistorySchema.statics.findErrors = function () {
  return this.find({
    "processingDetails.error": { $exists: true, $ne: null },
  }).sort({ createdAt: -1 });
};

// Export the model
export const VideoHistory =
  models.VideoHistory ||
  model<IVideoHistory>("VideoHistory", videoHistorySchema);
