"use client";

import React, { useState, useCallback, useRef } from "react";
import AudioRecorderButton from "./ui/AudioRecorderButton";
import { createClient } from "@/lib/supabase/client";

interface AudioDescriptionRecorderProps {
  initialDescription?: string;
  onChange?: (description: string) => void;
}

const API_BASE = "https://speech-to-text-api-322039733047.asia-south1.run.app";

const AudioDescriptionRecorder: React.FC<AudioDescriptionRecorderProps> = ({
  initialDescription = "",
  onChange,
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Stabilize supabase client — never recreated
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // ✅ Stabilize onChange ref so transcribeAudio doesn't recreate
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const transcribeAudio = useCallback(async (audioUrl: string) => {
    setIsTranscribing(true);
    setError(null);
    console.log("Sending to transcription API:", audioUrl);

    try {
      const response = await fetch(`${API_BASE}/speech-to-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: audioUrl,
        }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

      if (!data?.transcript) {
        throw new Error("Invalid response format: transcript missing");
      }

      setDescription(data.transcript);
      onChangeRef.current?.(data.transcript);
    } catch (err: any) {
      console.error("Transcription failed:", err);
      setError("Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  }, []); // ✅ No dependencies — stable forever

  const handleUploadComplete = useCallback(async (fileName: string) => {
    console.log("handleUploadComplete called with:", fileName);

    const { data } = supabase
      .storage
      .from("audio-records")
      .getPublicUrl(fileName);

    console.log("Public URL:", data?.publicUrl);

    const publicUrl = data?.publicUrl;

    if (!publicUrl) {
      console.error("Failed to generate public URL.");
      setError("Failed to access uploaded audio.");
      return;
    }

    await transcribeAudio(publicUrl);
  }, [supabase, transcribeAudio]); // ✅ Both are now stable

  const handleTextareaChange = (value: string) => {
    setDescription(value);
    onChangeRef.current?.(value);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <AudioRecorderButton onUploadComplete={handleUploadComplete} />

      <div className="text-center font-semibold text-gray-500">OR</div>

      <textarea
        value={description}
        onChange={(e) => handleTextareaChange(e.target.value)}
        placeholder="Write your description here..."
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
      />

      {isTranscribing && (
        <div className="text-gray-500 text-sm">
          Transcribing audio...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default AudioDescriptionRecorder;