import React from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  if (!isOpen) return null;

  // Convert youtube watch URL to embed URL if needed
  let embedUrl = videoUrl;
  if (videoUrl.includes("youtube.com/watch?v=")) {
    const videoId = videoUrl.split("v=")[1]?.split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (videoUrl.includes("youtu.be/")) {
    const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  const isDirectVideo = videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900/90 px-4 py-3 text-white">
          <h3 className="font-display text-sm md:text-base font-semibold truncate pr-4">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="বন্ধ করুন"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          {isDirectVideo ? (
            <video src={videoUrl} controls autoPlay className="size-full object-contain" />
          ) : (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
