import async from 'async'

type ExecFn<T, R> = (task: T) => Promise<R>

type ExecResult<T, R> = {
  task: T
  result?: R
  error?: Error
}

type ParrallelResult<T, R> = {
  successes: ExecResult<T, R>[]
  errors: ExecResult<T, R>[]
}

type ParrallelActions<T, R> = {
  stop: () => Promise<void>
  finished: () => Promise<ParrallelResult<T, R>>
}

export function parallel<T, R>(
  tasks: T[],
  limit: number,
  fn: ExecFn<T, R>,
  processKill = false
): ParrallelActions<T, R> {
  let errors: ExecResult<T, R>[] = []
  let successes: ExecResult<T, R>[] = []

  const queue = async.queue(async (task: T) => {
    try {
      const result = await fn(task)
      successes = successes.concat({
        task,
        result,
      })
    } catch (error) {
      errors = errors.concat({
        task,
        error,
      })
    }
  }, limit)

  queue.push(tasks)

  async function stop() {
    await queue.kill()
    await queue.drain()
  }

  if (processKill) {
    process.on('SIGINT', function () {
      console.log('SIGINT, stopping queue')
      stop().then(() => {
        console.log('queue stopped, killing process')
        process.exit()
      })
    })
  }

  async function finished(): Promise<ParrallelResult<T, R>> {
    await queue.drain()
    return {
      errors,
      successes,
    }
  }

  return {
    stop,
    finished,
  }
}
