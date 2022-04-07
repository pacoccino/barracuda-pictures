import { listDirRecursive } from 'src/lib/files/fs'
import { Task } from 'src/lib/importer/importFile'

export async function listTasksFromDisk(rootDir: string) {
  const files = await listDirRecursive(rootDir)
  const tasks: Task[] = files.map((path) => ({ path }))
  return tasks
}

export async function listTasksFromS3(rootDir: string) {
  // const files = await listDirRecursive(rootDir)
  // const tasks: Task[] = files.map((path) => ({ path }))
  // return tasks
  return []
}
