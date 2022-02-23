import { Task, TaskResult } from 'src/lib/importer/importFile'
import { ParrallelResult } from 'src/lib/async'
import fsPromise from 'fs/promises'

async function addLog(path, data, index) {
  let obj = {}

  try {
    const existing = await fsPromise.readFile(path, 'utf-8')
    obj = JSON.parse(existing)
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }

  obj[index] = data

  await fsPromise.writeFile(path, JSON.stringify(obj, null, 2))
}

export async function reportSuccesses(
  successes: ParrallelResult<Task, TaskResult>['successes'],
  logIndex
) {
  const splitSuccess: Record<TaskResult, string[]> = {
    EXCLUDED: [],
    EXISTING: [],
    NO_DATE: [],
    UPLOADED: [],
  }
  for (const i in successes) {
    const res = successes[i]
    splitSuccess[res.result].push(res.task.path)
  }

  await addLog('./logs/importResult.json', splitSuccess, logIndex)

  return splitSuccess
}

export async function reportErrors(
  errors: ParrallelResult<Task, TaskResult>['errors'],
  logIndex
) {
  const es = errors.map((e) => ({
    ...e,
    errorMessage: e.error.message,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errorCode: e.error.code,
  }))

  await addLog('./logs/importErrors.json', es, logIndex)

  return errors
}

export async function reportExecution(
  tasks: Task[],
  result: ParrallelResult<Task, TaskResult>,
  logger
) {
  const logIndex = new Date().toISOString()
  const successes = await reportSuccesses(result.successes, logIndex)
  const errors = await reportErrors(result.errors, logIndex)

  logger.info(`Execution status:`)
  logger.info(`- TASKS: ${tasks.length}`)
  logger.info(`- UPLOADED: ${successes.UPLOADED.length}`)
  logger.info(`- EXCLUDED: ${successes.EXCLUDED.length}`)
  logger.info(`- NO_DATE: ${successes.NO_DATE.length}`)
  logger.info(`- EXISTING: ${successes.EXISTING.length}`)
  logger.info(`- ERRORS: ${errors.length}`)

  return {
    successes,
    errors,
  }
}
