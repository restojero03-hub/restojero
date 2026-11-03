import Image from "next/image";
import type { ReactNode } from "react";

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  sizes: string;
};

export function Figure({ src, alt, width, height, caption, sizes }: FigureProps) {
  return (
    <figure>
      <div className="drawing-frame overflow-visible">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className="block h-auto w-full"
        />
      </div>
      {caption && <figcaption className="drawing-label mt-2">{caption}</figcaption>}
    </figure>
  );
}
