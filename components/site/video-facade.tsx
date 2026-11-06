"use client";

import { Play } from "lucide-react";
import { useState } from "react";

// YouTube loads nothing until someone asks to play, which keeps the page fast.
export function VideoFacade({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="neu relative aspect-video w-full overflow-hidden rounded-[10px]">
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
          className="flex size-full cursor-pointer flex-col items-center justify-center gap-3 p-4 text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Play className="size-6" aria-hidden />
          </span>
          <span className="font-medium text-title">{title}</span>
          <span className="text-xs">Plays from YouTube</span>
        </button>
      )}
    </div>
  );
}
