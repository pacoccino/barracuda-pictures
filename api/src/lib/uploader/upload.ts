import { listDirRecursive, open } from 'src/lib/files/fs'
import { S3Lib } from 'src/lib/files/s3'
import { parallel } from 'src/lib/async'
import ft from 'file-type'

import { ACCEPTED_EXTENSIONS } from 'src/lib/images/constants'

const PARALLEL_UPLOAD = 5

const dir = process.env['FILESYSTEM_FOLDER']

async function uploadFile(path: string) {
  let fd
  try {
    const fullPath = `${dir}/${path}`
    fd = await open(fullPath, 'r')
    //const stream = fd.createReadStream()

    const buffer = await fd.readFile()
    const fileType = await ft.fromBuffer(buffer)
    if (!fileType || ACCEPTED_EXTENSIONS.indexOf(fileType.ext) === -1) {
      throw new Error(
        `Unsupported file type for ${path} ${fileType?.ext || ''}`
      )
    }

    const stat = await fd.stat()
    const metadata = {
      created_at: stat.birthtime.toISOString(),
      modified_at: stat.mtime.toISOString(),
    }

    await S3Lib.put(`test_upload/${path}`, buffer, metadata, fileType.mime)

    return path
  } finally {
    await fd?.close()
  }
}

export async function upload() {
  console.log('Uploader script started')

  console.log('Emptying bucket...')
  await S3Lib.deletePrefix('test_upload')

  console.log('Getting file list from file system...')
  const files = await listDirRecursive(dir)

  console.log('uploading files to S3', files.length)
  const uploadResult = await parallel(files, PARALLEL_UPLOAD, uploadFile)

  console.log('Finished script')
  console.log(
    `${uploadResult.successes.length} success, ${uploadResult.errors.length} errors`
  )
  if (uploadResult.errors.length) console.log('errors:', uploadResult.errors)
}
