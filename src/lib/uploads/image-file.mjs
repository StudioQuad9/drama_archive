export const IMAGE_BUCKET = "article-images";
export const IMAGE_MAX_BYTES = 50 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif";

export function imageReference(path) {
  return `storage://${IMAGE_BUCKET}/${path}`;
}

export function parseImageReference(value) {
  const match = /^storage:\/\/article-images\/([0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:jpg|png|webp|avif|gif))$/i.exec(value);
  return match ? { bucket: IMAGE_BUCKET, path: match[1] } : null;
}

export async function inspectImage(file) {
  if (!file || file.size === 0) throw new Error("空のファイルは送信できません。");
  if (file.size > IMAGE_MAX_BYTES) throw new Error("現在の受付上限は1ファイル50MBです。");
  const bytes = new Uint8Array(await file.slice(0, 256).arrayBuffer());
  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  let result;
  if ([137,80,78,71,13,10,26,10].every((value, index) => bytes[index] === value)) {
    result = { contentType: "image/png", extension: "png" };
  } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    result = { contentType: "image/jpeg", extension: "jpg" };
  } else if (["GIF87a", "GIF89a"].includes(ascii(0, 6))) {
    result = { contentType: "image/gif", extension: "gif" };
  } else if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    result = { contentType: "image/webp", extension: "webp" };
  } else if (ascii(4, 8) === "ftyp") {
    const view = new DataView(bytes.buffer);
    const end = Math.min(view.getUint32(0), bytes.length);
    const brands = [ascii(8, 12)];
    for (let offset = 16; offset + 4 <= end; offset += 4) brands.push(ascii(offset, offset + 4));
    if (brands.includes("avif") || brands.includes("avis")) result = { contentType: "image/avif", extension: "avif" };
  }
  if (!result || (file.type && file.type !== result.contentType)) {
    throw new Error("JPEG・PNG・WebP・AVIF・GIFの画像ファイルを選んでください。");
  }
  return result;
}
