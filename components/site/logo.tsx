import Image from "next/image";
import type { SiteContent } from "@/lib/content/schema";

export function Logo({ text, photo }: { text: string; photo: SiteContent["hero"]["photo"] }) {
  return (
    <a href="#home" aria-label="Back to the top of the page" className="flex items-center">
      <span className="size-12 overflow-hidden rounded-full bg-[#dfe5ee] sm:size-14">
        <Image src={photo.src} alt="" width={700} height={960} sizes="56px" className="block w-full" />
      </span>
      <span className="ml-2 font-heading text-2xl font-bold tracking-wide text-title sm:text-3xl">{text}</span>
    </a>
  );
}
