import async from 'async'

type ExecFn<T, R> = (task: T) => Promise<R>
type ExecResult<T, R> = {
  task: T
  result?: R
  error?: Error
}

function reflect<T, R>(fn: ExecFn<T, R>) {
  return async (task: T): Promise<ExecResult<T, R>> => {
    try {
      const result = await fn(task)
      return {
        task,
        result,
      }
    } catch (error) {
      return {
        task,
        error,
      }
    }
  }
}

export async function parallel<T, R>(
  tasks: T[],
  limit: number,
  fn: ExecFn<T, R>
) {
  const results = await async.mapLimit(tasks, limit, reflect(fn))
  const errors = results.reduce(
    (acc, curr) => (curr.error ? acc.concat(curr) : acc),
    []
  )
  const successes = results.reduce(
    (acc, curr) => (curr.result ? acc.concat(curr) : acc),
    []
  )
  return {
    errors,
    successes,
  }
}
