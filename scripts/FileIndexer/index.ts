import { scanFiles } from 'api/src/lib/images/scanner'

export default async () => {
  await scanFiles()
}
