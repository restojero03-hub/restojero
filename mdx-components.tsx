import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Figure } from "@/components/blueprint/figure";
import { FlowLine } from "@/components/diagrams/flow-line";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-14 text-2xl font-semibold first:mt-0 sm:text-3xl" {...props} />,
  h3: (props) => <h3 className="mt-8 text-xl font-semibold" {...props} />,
  p: (props) => <p className="mt-4 max-w-prose text-lg" {...props} />,
  ul: (props) => <ul className="mt-4 max-w-prose list-disc space-y-2 pl-5 text-lg" {...props} />,
  a: ({ href, ...props }: ComponentProps<"a">) => (
    <a className="text-link" href={href} target="_blank" rel="noopener noreferrer" {...props} />
  ),
  Figure,
  FlowLine,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
