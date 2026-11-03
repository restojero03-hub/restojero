import { createHash } from "node:crypto";

// One-way hashes of names and email addresses from the old CV. This repo
// is public, so the check can't list them in plain text. To add a term, hash
// its lowercase form with SHA-256.
const PRIVATE_TERM_HASHES = new Set([
  "4d428a8c43743f48f9a14bac4638de14d345670b1b554adc4a4955109d7c1b5b",
  "f369a3a2fd545c6f62be737698b97f9ee2fe5ddab493b6fc75b95be2da5997de",
  "103e79c23361fbcca44722dd981a9a9f28e10f9c0e03b08d43398e8a1e9970ac",
  "1ea0d42878c58dfcee771674e72f1ac30830c7473db0d2d3e8df363234cdd791",
  "529f01b8c220700f6f2eb6819beca4b57a36cb5724ff42f84526fa77ae8b74cb",
  "cc8663634a11c2afd3ca54eab9484dfb7c0c8a0d70b5bab5126d2baf3a91ed7b",
  "97280c38e55ea20962256bd644269b19eee6f43b0ba20103d59716d35e08708e",
  "137e1c2d0500effeede03290518a2a1b5866d8df966e971ee30bb785a0006d5c",
  "0246da3be750250a88e98cfb06b43a2f5a767375f5d972463d8b4424c93f2cdf",
  "01a9c155792f77b81336452c2712c5fca7ceeb673e8c482bf9612a911a1e1c54",
]);

export const PHONE_PATTERN = /\d{3}[\s-]?\d{3}[\s-]?\d{4}/;

export function findPrivateTerms(text: string): string[] {
  const words = text.toLowerCase().match(/[a-z0-9._%+@-]+/g) ?? [];
  return words
    .map((word) => word.replace(/[._-]+$/, ""))
    .filter((word) => PRIVATE_TERM_HASHES.has(createHash("sha256").update(word).digest("hex")));
}
