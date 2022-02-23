import { importer } from 'api/src/lib/importer/importer'

export default async ({ args }) => {
  const rootDir = args.d
  if (!rootDir) throw new Error('Please provide -d ROOT_DIR argument')
  const prefix = args.p
  await importer({ rootDir, prefix })
}
