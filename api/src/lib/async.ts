import async from 'async'

function reflect(fn) {
  return async (task) => {
    try {
      const success = await fn(task)
      return {
        task,
        success,
      }
    } catch (error) {
      return {
        task,
        error,
      }
    }
  }
}

export async function parallel(files, limit, fn) {
  const results = await async.mapLimit(files, limit, reflect(fn))
  const errors = results.reduce(
    (acc, curr) => (curr.error ? acc.concat(curr) : acc),
    []
  )
  const successes = results.reduce(
    (acc, curr) => (curr.success ? acc.concat(curr) : acc),
    []
  )
  return {
    errors,
    successes,
  }
}
