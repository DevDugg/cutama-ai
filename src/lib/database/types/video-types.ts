import { VideoStatus } from "./video-enums";
import { Document } from "mongoose";

export interface IVideo extends Document {
  userId: string;
  title: string;
  description?: string;
  originalUrl: string;
  processedUrl?: string;
  thumbnailUrl?: string;
  status: VideoStatus;
  duration?: number;
  fileSize: number;
  format: string;
  metadata: {
    width?: number;
    height?: number;
    codec?: string;
    bitrate?: number;
  };
  processingOptions?: {
    quality?: string;
    format?: string;
    effects?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  isDeleted: boolean;
}

export interface IVideoHistory extends Document {
  videoId: string;
  userId: string;
  action: string;
  status: VideoStatus;
  processingDetails?: {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    error?: string;
    progress?: number;
  };
  metadata: {
    inputFormat?: string;
    outputFormat?: string;
    inputSize?: number;
    outputSize?: number;
    effects?: string[];
  };
  createdAt: Date;
  isSuccess: boolean;
}
