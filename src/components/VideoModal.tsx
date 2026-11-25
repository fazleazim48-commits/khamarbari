import React, { useEffect, useState } from "react";
import { X, Film } from "lucide-react";
import { getVideoBlob } from "@/lib/video-db";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    if (isOpen && videoUrl && videoUrl.startsWith("indexeddb:")) {
      const key = videoUrl.replace("indexeddb:", "");
      setLoading(true);
      getVideoBlob(key)
        .then((blob) => {
          if (active && blob) {
            createdUrl = URL.createObjectURL(blob);
            setBlobUrl(createdUrl);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      setBlobUrl(null);
    }

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, videoUrl]);

  if (!isOpen) return null;

  // Convert youtube watch URL to embed URL if needed
  let embedUrl = videoUrl;
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  if (videoUrl.includes("youtube.com/watch?v=")) {
    const videoId = videoUrl.split("v=")[1]?.split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (videoUrl.includes("youtu.be/")) {
    const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  const isUploadedVideo = videoUrl.startsWith("indexeddb:");
  const isDirectVideo = videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm") || videoUrl.endsWith(".ogg");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900/90 px-4 py-3 text-white">
          <div className="flex items-center gap-2 truncate pr-4">
            <Film className="size-4 text-primary shrink-0" />
            <h3 className="font-display text-sm md:text-base font-semibold truncate">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="বন্ধ করুন"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {loading ? (
            <div className="text-white text-sm flex items-center gap-2">
              <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>ভিডিও লোড হচ্ছে...</span>
            </div>
          ) : isUploadedVideo ? (
            blobUrl ? (
              <video src={blobUrl} controls autoPlay className="size-full object-contain" />
            ) : (
              <div className="p-6 text-center text-white max-w-md">
                <Film className="mx-auto size-12 text-primary/70 mb-3" />
                <h4 className="font-bold text-base text-white">ভিডিওটি খুঁজে পাওয়া যায়নি</h4>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                  ভিডিওটি লোকাল ব্রাউজারে আপলোড করা ছিল। সব ভিজিটর যেন যেকোনো মোবাইল বা কম্পিউটার থেকে দেখতে পায়, সেজন্য অ্যাডমিন প্যানেল থেকে একটি ইউটিউব (YouTube) ভিডিও লিংক যুক্ত করুন।
                </p>
              </div>
            )
          ) : isYouTube ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full border-0"
            />
          ) : (
            <video src={videoUrl} controls autoPlay className="size-full object-contain" />
          )}
        </div>
      </div>
    </div>
  );
}
