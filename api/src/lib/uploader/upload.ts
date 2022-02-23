import { listDirRecursive, open } from 'src/lib/files/fs'
import { Buckets } from 'src/lib/files/s3'
import { parallel } from 'src/lib/async'
import ft from 'file-type'
import { logger as parentLogger } from 'src/lib/logger'

import { ACCEPTED_EXTENSIONS } from 'src/lib/images/constants'

const logger = parentLogger.child({ module: 'UPLOADER' })

const PARALLEL_UPLOAD = 5

enum TaskResult {
  EXISTING = 'EXISTING',
  UPLOADED = 'UPLOADED',
}

type Task = {
  rootDir: string
  path: string
  prefix: string
}

async function uploadFile({ rootDir, path, prefix }: Task) {
  let fd
  try {
    const fullPath = `${rootDir}/${path}`
    const S3Path = `${prefix ? `${prefix}/` : ''}${path}`
    logger.debug(`uploading image ${fullPath}`)

    fd = await open(fullPath, 'r')
    //const stream = fd.createReadStream()

    const head = await Buckets.photos.head(S3Path).catch((error) => {
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

    await Buckets.photos.put(S3Path, buffer, metadata, fileType.mime)

    logger.debug(`uploaded image ${fullPath}`)

    return TaskResult.UPLOADED
  } finally {
    await fd?.close()
  }
}

export async function upload({
  rootDir,
  prefix,
}: {
  rootDir: string
  prefix?: string
}) {
  logger.info('Uploader script started')

  logger.debug('Getting file list from file system...')
  const files = await listDirRecursive(rootDir)
  const tasks: Task[] = files.map((path) => ({ rootDir, path, prefix }))

  logger.debug({ filesLength: files.length }, 'uploading files to S3')
  const parallelActions = await parallel<Task, TaskResult>(
    tasks,
    PARALLEL_UPLOAD,
    uploadFile,
    true
  )

  const uploadResult = await parallelActions.finished()
  if (uploadResult.errors.length)
    logger.error({ errors: uploadResult.errors }, 'error:')

  const uploaded = uploadResult.successes.filter(
    (s) => s.result === TaskResult.UPLOADED
  ).length
  const existing = uploadResult.successes.filter(
    (s) => s.result === TaskResult.EXISTING
  ).length
  logger.info(
    `Upload finished: ${uploaded} uploaded, ${existing} existing, ${uploadResult.errors.length} errors`
  )
}
