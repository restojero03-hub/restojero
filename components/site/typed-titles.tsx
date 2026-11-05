"use client";

import { useEffect, useMemo, useState } from "react";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1800;

const withArticle = (title: string) => `${/^[aeiou]/i.test(title) ? "an" : "a"} ${title}`;

// Types each title, holds it, deletes it, then moves to the next. Visitors who ask
// for less motion just see the first title.
export function TypedTitles({ titles: rawTitles }: { titles: string[] }) {
  const titles = useMemo(() => rawTitles.map(withArticle), [rawTitles]);
  const [titleIndex, setTitleIndex] = useState(0);
  const [length, setLength] = useState(titles[0].length);
  const [deleting, setDeleting] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (titles.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = setTimeout(() => setAnimating(true), HOLD_MS);
    return () => clearTimeout(start);
  }, [titles.length]);

  useEffect(() => {
    if (!animating) return;
    const title = titles[titleIndex];
    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && length === title.length) delay = HOLD_MS;

    const timer = setTimeout(() => {
      if (!deleting && length === title.length) {
        setDeleting(true);
      } else if (deleting && length === 0) {
        setDeleting(false);
        setTitleIndex((index) => (index + 1) % titles.length);
      } else {
        setLength((value) => value + (deleting ? -1 : 1));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [animating, deleting, length, titleIndex, titles]);

  return (
    <span aria-hidden>
      {titles[titleIndex].slice(0, length)}.
      <span className="typed-caret" />
    </span>
  );
}
