import { listDirRecursive, open } from 'src/lib/files/fs'
import { S3Lib } from 'src/lib/files/s3'
import { parallel } from 'src/lib/async'
import ft from 'file-type'

import { ACCEPTED_EXTENSIONS } from 'src/lib/images/constants'

const PARALLEL_UPLOAD = 5

const s3photos = new S3Lib(process.env['S3_BUCKET_PHOTOS'])

enum TaskResult {
  EXISTING = 'EXISTING',
  UPLOADED = 'UPLOADED',
}

type Task = {
  rootDir: string
  path: string
}

async function uploadFile({ rootDir, path }) {
  let fd
  try {
    const fullPath = `${rootDir}/${path}`
    fd = await open(fullPath, 'r')
    //const stream = fd.createReadStream()

    const head = await s3photos.head(path).catch((error) => {
      if (error.code === 'NotFound') {
        return null
      } else throw error
    })

    if (head) return TaskResult.EXISTING

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

    await s3photos.put(path, buffer, metadata, fileType.mime)

    return TaskResult.UPLOADED
  } finally {
    await fd?.close()
  }
}

export async function upload({ rootDir }) {
  console.log('Uploader script started')

  console.log('Getting file list from file system...')
  const files = await listDirRecursive(rootDir)
  const tasks = files.map((path) => ({ rootDir, path }))

  console.log('uploading files to S3', files.length)
  const uploadResult = await parallel<Task, TaskResult>(
    tasks,
    PARALLEL_UPLOAD,
    uploadFile
  )

  console.log('Finished script')
  console.log(
    `${uploadResult.successes.length} success, ${uploadResult.errors.length} errors`
  )
  const uploaded = uploadResult.successes.filter(
    (s) => s.result === TaskResult.UPLOADED
  ).length
  const existing = uploadResult.successes.filter(
    (s) => s.result === TaskResult.EXISTING
  ).length
  console.log(`${uploaded} uploaded, ${existing} existing`)

  if (uploadResult.errors.length) console.log('errors:', uploadResult.errors)
}
