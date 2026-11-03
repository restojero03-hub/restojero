"use client";

import { Play } from "lucide-react";
import { useState } from "react";

// YouTube loads nothing until someone asks to play, which keeps the page fast.
export function VideoFacade({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="drawing-frame aspect-video w-full">
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="flex size-full flex-col items-center justify-center gap-3 p-4 text-center hover:bg-accent"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Play className="size-5" aria-hidden />
          </span>
          <span className="font-medium">{title}</span>
          <span className="drawing-label">Plays from YouTube</span>
        </button>
      )}
    </div>
  );
}
