"use client";

import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";

const Upload = () => {
  const form = useForm<{ video: FileList }>();
  const { handleSubmit } = form;
  const [isUploading, setIsUploading] = useState(false);
  const onSubmit = (data: { video: FileList }) => {
    const file = data.video ? data.video[0] : null;
    if (!file) {
      toast.error("Please upload a video");
      return;
    }
    // upload to the server
    console.log(file);
    toast.success("Video uploaded successfully");
  };
  return (
    <Card className="w-fit p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="video"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => onChange(e.target.files)}
                onBlur={onBlur}
                name={name}
                ref={ref}
              />
            )}
          />
          <CldUploadButton uploadPreset="default" />
          {/* <Button
            type="submit"
            className="cursor-pointer"
            disabled={isUploading}
          >
            Upload Video
          </Button> */}
        </form>
      </Form>
    </Card>
  );
};

export default Upload;
