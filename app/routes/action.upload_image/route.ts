import type { ActionArgs } from "@remix-run/node";
import sharp from "sharp";
import { join } from "path";
import { IMAGE_TMP_FOLDER } from "~/util/variable.server";
import * as fs from "fs";
import { Readable } from "stream";

function domStreamToNodeStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    },
  });
}

export const action = async ({ request }: ActionArgs) => {
  const form_data = await request.formData();
  const image_files = form_data.getAll("sampleFiles") as File[];

  return Promise.all(image_files.map(async file => {
    const raw_binary = await file.arrayBuffer();
    const webp_binary = await sharp(raw_binary).webp().toBuffer();

    const file_name = crypto.randomUUID();
    const raw_file_name = file.name.split(".");
    const webp_name = `${ file_name }.webp`;

    // save image as webp
    await sharp(webp_binary).toFile(join(IMAGE_TMP_FOLDER, webp_name));

    // save a copy
    const write_stream = fs.createWriteStream(join(IMAGE_TMP_FOLDER, `${ file_name }.${ raw_file_name.at(-1) }`));
    const file_stream = domStreamToNodeStream(file.stream());
    file_stream.pipe(write_stream);

    return {
      name: raw_file_name.slice(0, raw_file_name.length - 1).join("."),
      path: join(".tmp", webp_name),
    };
  }));
};