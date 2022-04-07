import { importer } from 'api/src/lib/importer/importer'

/*

Arguments:

-d Local directory where to get images
-s Get files from s3
-p PREFIX (optional) S3 prefix where to put images
-r force re-upload files on S3 even if already there

*/

export default async ({ args }) => {
  const s3Prefix = args.p || ''

  const fromS3 = args.s
  const filesDir = args.d
  if (!filesDir && !fromS3)
    throw new Error('Please provide -d FILES_DIR argument or -s to get from S3')
  if (filesDir && fromS3)
    throw new Error('Cannot get from file system and S3 at the same time')

  const s3Reupload = fromS3 ? false : args.r || false

  await importer({
    s3Prefix,
    fromS3,
    filesDir,
    s3Reupload,
  })
}
