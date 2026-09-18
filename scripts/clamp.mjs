// scripts/calClamp.mjs

import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const readline = createInterface({
  input: stdin,
  output: stdout,
});

function createClamp(minSize, maxSize, minViewport, maxViewport) {
  const vw = ((maxSize - minSize) / (maxViewport - minViewport)) * 100;

  const px = minSize - (vw * minViewport) / 100;

  const roundedVw = Number(vw.toFixed(3));
  const roundedPx = Number(px.toFixed(3));

  const preferred =
    roundedPx === 0
      ? `${roundedVw}vw`
      : `calc(${roundedPx}px + ${roundedVw}vw)`;

  return `clamp(${minSize}px, ${preferred}, ${maxSize}px)`;
}

const minSize = Number(await readline.question("最小寸法 [16]: ")) || 16;

const maxSize = Number(await readline.question("最大寸法 [64]: ")) || 64;

const minViewport =
  Number(await readline.question("開始画面幅 [375]: ")) || 375;

const maxViewport =
  Number(await readline.question("終了画面幅 [1440]: ")) || 1440;

readline.close();

const result = createClamp(minSize, maxSize, minViewport, maxViewport);

console.log(`\n${result}\n`);

execFileSync("pbcopy", {
  input: result,
});

console.log("クリップボードにコピーしました。");