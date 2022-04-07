import { listDirRecursive } from 'src/lib/files/fs'
import { Task } from 'src/lib/importer/importFile'
import { Buckets } from 'src/lib/files/s3'

export async function listTasksFromDisk(rootDir: string) {
  const files = await listDirRecursive(rootDir)
  const tasks: Task[] = files.map((path) => ({ path }))
  return tasks
}

export async function listTasksFromS3(prefix: string) {
  const paths = await Buckets.photos.list(prefix)
  const tasks: Task[] = paths.map((path) => ({ path }))
  return tasks
}
