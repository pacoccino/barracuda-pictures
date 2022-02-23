import { parallel } from 'src/lib/async'
import { logger as parentLogger } from 'src/lib/logger'
import { getImportWorker, Task, TaskResult } from 'src/lib/importer/importFile'
import { listTasks } from 'src/lib/importer/listTasks'

const logger = parentLogger.child({ module: 'UPLOADER' })

const PARALLEL_LIMIT = 5

export async function importer({
  rootDir,
  prefix,
}: {
  rootDir: string
  prefix?: string
}) {
  logger.info('Uploader script started')

  logger.debug('Getting file list from file system...')
  const tasks = await listTasks(rootDir)
  logger.debug({ filesLength: tasks.length }, 'uploading files...')

  const uploadFileWorker = getImportWorker({
    logger,
    prefix,
    rootDir,
  })

  const parallelActions = await parallel<Task, TaskResult>(
    tasks,
    PARALLEL_LIMIT,
    uploadFileWorker,
    true
  )

  const uploadResult = await parallelActions.finished()
  if (uploadResult.errors.length)
    logger.error({ errors: uploadResult.errors }, 'errors while uploading')

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
