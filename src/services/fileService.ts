import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs/promises";
import { v4 } from "uuid";
import ServiceResponse from "~/util/serviceResponse";
import { fileTypeFromBuffer } from "file-type";

class FileService {
  __dirname: string = "";
  __uploads: string = "";
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    this.__dirname = dirname(__filename);
    this.__uploads = path.join(this.__dirname, "../", "uploads");
  }
  async uploadSingleFile(file: File, paths: Array<string>) {
    try {
      // check mime type
      if (!file.type.match("^[^s]+.(jpg|jpeg|png|gif|bmp)$")) {
        return ServiceResponse.create(false, [
          "file mime type is not supported",
        ]);
      }
      // parse exetnsion
      const extension = file.type.split("/")[1];
      const fileName = `${v4()}.${extension}`;

      const absolutePath = path.join(this.__uploads, ...paths, fileName);
      // ensure folder if not exist
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(absolutePath, buffer);

      console.log(`File uploaded successfully to ${absolutePath}`);
      return ServiceResponse.create(true, [], {
        file: file,
        fileName: fileName,
        path: absolutePath,
      });
    } catch (err) {
      console.log(err);
      return ServiceResponse.create(false, ["internal server error"]);
    }
  }
  async getFile(paths: Array<string>) {
    try {
      const absolutePath = path.join(this.__uploads, ...paths);
      const data = await fs.readFile(absolutePath);

      const { mime, ext }: any = await fileTypeFromBuffer(data);
      const fileName = paths[paths.length - 1];
      const fileFromBuffer = new File([data], fileName, { type: mime });

      return ServiceResponse.create(false, [], fileFromBuffer);
    } catch (err) {
      console.log(err);
      return ServiceResponse.create(false, ["error occured while reading img"]);
    }
  }
}

export default FileService;
