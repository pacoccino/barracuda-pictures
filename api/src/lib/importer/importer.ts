import { parallel } from 'src/lib/async'
import { logger as parentLogger } from 'src/lib/logger'
import { getImportWorker, Task, TaskResult } from 'src/lib/importer/importFile'
import { listTasksFromDisk } from 'src/lib/importer/listTasks'
import { assertReporterReady, reportExecution } from 'src/lib/importer/reporter'

const logger = parentLogger.child({ module: 'UPLOADER' })

const PARALLEL_LIMIT = 5

export interface ImportOptions {
  filesDir: string
  s3Prefix: string
  s3Reupload?: boolean
}

export async function importer(importOptions: ImportOptions) {
  logger.info('Importer script started')
  console.time('exec')
  await assertReporterReady()

  logger.debug('Getting file list from file system...')
  const tasks = await listTasksFromDisk(importOptions.filesDir)
  logger.debug({ filesLength: tasks.length }, 'Importing files...')

  const uploadFileWorker = getImportWorker({
    logger,
    importOptions,
  })

  const parallelActions = await parallel<Task, TaskResult>(
    tasks,
    PARALLEL_LIMIT,
    uploadFileWorker,
    true
  )

  const result = await parallelActions.finished()

  await reportExecution(tasks, result, logger)

  console.timeEnd('exec')
  logger.info(`Import finished.`)
}
