export const getBorder = (borderColor = "red", borderWidth = 1) => {
  return { borderColor, borderWidth };
};

export const INTERVALS = {
  ms250: 250,
  ms500: 500,
  ms750: 750,
};

function randomInteger(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

function randomRgbColor() {
  const r = randomInteger(255);
  const g = randomInteger(255);
  const b = randomInteger(255);
  return [r, g, b];
}

export function randomHexColor() {
  const [r, g, b] = randomRgbColor();

  const hr = r.toString(16).padStart(2, "0");
  const hg = g.toString(16).padStart(2, "0");
  const hb = b.toString(16).padStart(2, "0");

  return "#" + hr + hg + hb;
}
