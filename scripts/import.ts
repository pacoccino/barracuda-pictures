import { importer } from 'api/src/lib/importer/importer'

/*

Arguments:

-d Local directory where to get images
-p PREFIX (optional) S3 prefix where to put images
-r force re-upload files on S3 even if already there

*/

export default async ({ args }) => {
  const s3Prefix = args.p || ''
  const s3Reupload = args.r || false

  const fromS3 = args.s
  if (fromS3) {
    console.log('not implemented yet')
    process.exit()
  }
  const filesDir = args.d
  if (!filesDir) throw new Error('Please provide -d FILES_DIR argument')

  await importer({
    s3Prefix,
    filesDir,
    s3Reupload,
  })
}
