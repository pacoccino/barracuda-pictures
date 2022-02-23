import { Task, TaskResult } from 'src/lib/importer/importFile'
import { ParrallelResult } from 'src/lib/async'
import fsPromise from 'fs/promises'

export async function reportSuccesses(
  successes: ParrallelResult<Task, TaskResult>['successes']
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

  const str = JSON.stringify(splitSuccess)

  await fsPromise.writeFile('./logs/importResult.json', str)

  return splitSuccess
}

export async function reportErrors(
  errors: ParrallelResult<Task, TaskResult>['errors']
) {
  if (errors.length > 0) {
    const str = JSON.stringify(errors)
    await fsPromise.writeFile('./logs/importErrors.json', str)
  }

  return errors
}

export async function reportExecution(
  result: ParrallelResult<Task, TaskResult>,
  logger
) {
  const successes = await reportSuccesses(result.successes)
  const errors = await reportErrors(result.errors)

  logger.info(`Execution status:`)
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
