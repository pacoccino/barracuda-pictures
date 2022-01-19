import { staticServer } from "api/src/lib/static";

export default async () => {
  const path = process.env["FILESYSTEM_FOLDER"]
  staticServer(path)
}
