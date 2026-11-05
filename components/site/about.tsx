import { SectionHeading } from "@/components/site/section-heading";
import { VideoFacade } from "@/components/video-facade";
import { CV_PATH } from "@/lib/cv";
import type { SiteContent } from "@/lib/content/schema";

export function About({ about }: { about: SiteContent["about"] }) {
  return (
    <section id="about" aria-labelledby="about-heading" className="site-section">
      <div className="page-width">
        <SectionHeading id="about-heading" eyebrow={about.eyebrow} title={about.title} />
        <div className="neu-card grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="min-w-0">
            <div className="max-w-prose space-y-4 text-lg">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <a href={CV_PATH} download className="btn">
                Download my CV
              </a>
            </div>
          </div>
          {about.videoId && <VideoFacade videoId={about.videoId} title="Watch my intro video" />}
        </div>
      </div>
    </section>
  );
}
