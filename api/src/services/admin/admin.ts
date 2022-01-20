import { scanFiles } from 'src/lib/images/scanner'

export const scan = async () => {
  await scanFiles()
  return { success: true }
}
