import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

function ProjectCard({ project, wide }: { project: Project; wide: boolean }) {
  return (
    <li className={cn("drawing-frame flex flex-col", wide && "md:col-span-2 md:flex-row-reverse")}>
      {project.image && (
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={1200}
          height={700}
          sizes={wide ? "(min-width: 768px) 600px, 100vw" : "(min-width: 768px) 560px, 100vw"}
          className={cn(
            "block aspect-[12/7] w-full border-b object-cover object-top",
            wide && "md:w-1/2 md:border-b-0 md:border-l",
          )}
        />
      )}
      <div className={cn("flex flex-1 flex-col p-5", wide && "md:justify-center")}>
        <p className="drawing-label">{project.date}</p>
        <h3 className="mt-1 text-2xl leading-tight font-semibold">{project.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>
        <p className="mt-3">{project.summary}</p>
        <p className="drawing-label mt-3">{project.stack.join(", ")}</p>
        {(project.caseStudy || project.href) && (
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {project.caseStudy && (
              <Link prefetch={false} className="text-link" href={`/work/${project.caseStudy}`}>
                Read the case study
              </Link>
            )}
            {project.href && (
              <a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer">
                {`Visit ${project.title}`}
              </a>
            )}
          </p>
        )}
      </div>
    </li>
  );
}

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-6 border-t bg-background/70">
      <div className="page-width py-14 sm:py-20">
        <h2 id="projects-heading" className="text-3xl leading-[1.08] font-semibold sm:text-4xl">
          All projects
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} wide={index === 0} />
          ))}
        </ul>
      </div>
    </section>
  );
}
