import { upload } from 'api/src/lib/uploader/upload'

export default async ({ args }) => {
  const rootDir = args.d
  if (!rootDir) throw new Error('Please provide -d ROOT_DIR argument')
  const prefix = args.p
  await upload({ rootDir, prefix })
}
