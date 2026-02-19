"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AudioRecorderButtonProps {
  onUploadComplete?: (fileName: string) => void;
}

const AudioRecorderButton: React.FC<AudioRecorderButtonProps> = ({ onUploadComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const onUploadCompleteRef = useRef(onUploadComplete);
  const supabaseRef = useRef(createClient()); // ✅ Stable supabase client

  useEffect(() => {
    onUploadCompleteRef.current = onUploadComplete;
  }, [onUploadComplete]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = async () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const fileName = `recording-${Date.now()}.webm`;

      console.log("Recording stopped. Uploading to Supabase...");

      const { data, error } = await supabaseRef.current // ✅ Use ref
        .storage
        .from("audio-records")
        .upload(fileName, audioBlob, {
          contentType: "audio/webm",
          upsert: true,
        });

      if (error) {
        console.error("Upload failed:", error.message);
      } else {
        console.log("Upload successful:", data);
        console.log("onUploadComplete prop exists?", !!onUploadCompleteRef.current);

        if (onUploadCompleteRef.current) {
          onUploadCompleteRef.current(fileName);
        }
      }
    };

    mediaRecorder.stop();
    setIsRecording(false);
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      className={`px-4 py-2 rounded-md border transition ${
        isRecording
          ? "bg-red-600 border-red-700 hover:bg-red-700"
          : "bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
      }`}
    >
      {isRecording ? "Stop Recording" : "Record Audio"}
    </button>
  );
};

export default AudioRecorderButton;