import { Schema, model, models } from "mongoose";
import { IVideo } from "../types/video-types";
import { VideoStatus, VideoFormat } from "../types/video-enums";

const videoSchema = new Schema<IVideo>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be longer than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be longer than 500 characters"],
    },
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      validate: {
        validator: (v: string) => {
          try {
            new URL(v);
            return true;
          } catch (e) {
            return false;
          }
        },
        message: "Invalid URL format",
      },
    },
    processedUrl: {
      type: String,
      validate: {
        validator: (v: string) => {
          if (!v) return true;
          try {
            new URL(v);
            return true;
          } catch (e) {
            return false;
          }
        },
        message: "Invalid URL format",
      },
    },
    thumbnailUrl: String,
    status: {
      type: String,
      enum: Object.values(VideoStatus),
      default: VideoStatus.UPLOADING,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      min: [0, "Duration cannot be negative"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
      min: [0, "File size cannot be negative"],
    },
    format: {
      type: String,
      enum: Object.values(VideoFormat),
      required: [true, "Video format is required"],
    },
    metadata: {
      width: Number,
      height: Number,
      codec: String,
      bitrate: Number,
    },
    processingOptions: {
      quality: String,
      format: String,
      effects: [String],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
videoSchema.index({ userId: 1, createdAt: -1 });
videoSchema.index({ status: 1, createdAt: -1 });
videoSchema.index({ isPublic: 1, isDeleted: 1 });

// Virtual for video history
videoSchema.virtual("history", {
  ref: "VideoHistory",
  localField: "_id",
  foreignField: "videoId",
});

// Methods
videoSchema.methods.markAsProcessing = async function () {
  this.status = VideoStatus.PROCESSING;
  await this.save();
};

videoSchema.methods.markAsProcessed = async function (processedUrl: string) {
  this.status = VideoStatus.PROCESSED;
  this.processedUrl = processedUrl;
  await this.save();
};

videoSchema.methods.markAsFailed = async function () {
  this.status = VideoStatus.FAILED;
  await this.save();
};

videoSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  await this.save();
};

// Statics
videoSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId, isDeleted: false }).sort({ createdAt: -1 });
};

videoSchema.statics.findPublic = function () {
  return this.find({
    isPublic: true,
    isDeleted: false,
    status: VideoStatus.PROCESSED,
  }).sort({ createdAt: -1 });
};

// Middleware
videoSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    // Create history entry when status changes
    const VideoHistory = models.VideoHistory;
    if (VideoHistory) {
      VideoHistory.create({
        videoId: this._id,
        userId: this.userId,
        action: "STATUS_CHANGE",
        status: this.status,
        isSuccess: this.status === VideoStatus.PROCESSED,
      }).catch(console.error); // Log error but don't block save
    }
  }
  next();
});

// Export the model
export const Video = models.Video || model<IVideo>("Video", videoSchema);
