import { listDirRecursive } from 'src/lib/files/fs'
import { Task } from 'src/lib/importer/uploadFile'

export async function listTasks(rootDir: string) {
  const files = await listDirRecursive(rootDir)
  const tasks: Task[] = files.map((path) => ({ path }))
  return tasks
}
