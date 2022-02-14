import { scanFiles } from 'api/src/lib/scanner/scanner'
import { logger } from 'api/src/lib/logger'

import faktory from 'faktory-worker'

faktory.register('scan', async (taskArgs) => {
  logger.info('running scan in background worker')

  await scanFiles(taskArgs)
})

export default async ({ _args }) => {
  try {
    const worker = await faktory.work({
      password: process.env.FAKTORY_PASSWORD,
    })
    logger.info('logger started')

    worker.on('fail', ({ _job, error }) => {
      logger.error(`worker failed to run: ${error}`)
    })
  } catch (e) {
    logger.error(`worker failed to start: ${e}`)
    process.exit(1)
  }
}
