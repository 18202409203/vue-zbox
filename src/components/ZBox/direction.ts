import type { Direction, BasicDirection, Noop } from "./types";

export function decomposeDirection(direction: Direction | Noop) {
  if (direction === null || direction === undefined) return [];
  return direction.split("-") as BasicDirection[];
}
