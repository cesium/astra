import chroma from "chroma-js";

export function firstLastName(name: string | undefined) {
  if (!name) return "";

  if (name?.split(" ").length > 1) {
    return (
      name?.split(" ").filter(Boolean)[0] +
      " " +
      name?.split(" ").filter(Boolean).slice(-1)[0]
    );
  }

  return name?.split(" ").filter(Boolean);
}

export const editColor = (color: string, opacity: number, darken: number) => {
  const r = Math.floor(parseInt(color.slice(1, 3), 16) * darken);
  const g = Math.floor(parseInt(color.slice(3, 5), 16) * darken);
  const b = Math.floor(parseInt(color.slice(5, 7), 16) * darken);
  const a = opacity;
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

  return rgbaColor;
};

export function getContrastColor(baseColor: string, targetRatio: number = 5) {
  const base = chroma(baseColor.trim());
  let contrastColor;

  const direction = base.luminance() > 0.5 ? "darken" : "brighten";

  const step = 0.01;
  let modifier = 0;
  const maxModifier = 1;

  while (modifier <= maxModifier) {
    const candidate =
      direction === "darken"
        ? base.darken(modifier * 3)
        : base.brighten(modifier * 3);

    if (chroma.contrast(base, candidate) >= targetRatio) {
      contrastColor = candidate.hex();
      break;
    }

    modifier += step;
  }

  return contrastColor || (direction === "darken" ? "#000" : "#fff");
}
