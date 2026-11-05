// Moves one item up (-1) or down (+1). At either end the list stays as it is.
export function moveItem<T>(items: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function shown<T extends { visible: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.visible);
}
