import { site } from "@/content/site";

// Laid out like the title block in the corner of an engineering drawing.
export function SiteFooter() {
  return (
    <footer className="border-t bg-background print:hidden">
      <div className="page-width py-8">
        <dl className="drawing-frame grid grid-cols-1 sm:grid-cols-3 sm:divide-x">
          <div className="border-b p-4 sm:border-b-0">
            <dt className="drawing-label">Drawn by</dt>
            <dd className="mt-1 font-medium">
              {site.name} ({site.nickname})
            </dd>
          </div>
          <div className="border-b p-4 sm:border-b-0">
            <dt className="drawing-label">Location</dt>
            <dd className="mt-1 font-medium">
              {site.location} ({site.timezone})
            </dd>
          </div>
          <div className="p-4">
            <dt className="drawing-label">Find me</dt>
            <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <a
                className="text-link"
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="text-link"
                href={site.links.upwork}
                target="_blank"
                rel="noopener noreferrer"
              >
                Upwork profile
              </a>
              <a className="text-link" href={site.cvPath} download>
                Download CV
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
