import fsPromise, { FileHandle } from 'fs/promises'

export async function open(path: string, flags = 'r'): Promise<FileHandle> {
  return fsPromise.open(path, flags)
}

export async function listDir(path: string): Promise<Array<string>> {
  return fsPromise.readdir(path)
}

export async function listDirRecursive(
  path: string,
  subPath = ''
): Promise<Array<string>> {
  let files = []

  const dir = await fsPromise.opendir(`${path}${subPath ? '/' : ''}${subPath}`)
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      files = files.concat(`${subPath}${subPath ? '/' : ''}${dirent.name}`)
    } else if (dirent.isDirectory()) {
      const subfiles = await listDirRecursive(
        path,
        `${subPath}${subPath ? '/' : ''}${dirent.name}`
      )
      files = files.concat(subfiles)
    }
  }

  return files
}

type RecursiveFileIterator = {
  next: () => Promise<string | null>
}

/*
const a = await listDirRecursiveIter(path)

let b = await a.next()
while (b) {
  console.log(b)
  b = await a.next()
}
*/
export async function listDirRecursiveIter(
  rootPath: string
): Promise<RecursiveFileIterator> {
  const rootDir = await fsPromise.opendir(rootPath)

  const subPaths = [rootPath]
  const subDirs = [rootDir]

  async function next() {
    const depth = subPaths.length - 1
    if (depth < 0) return null

    const dirent = await subDirs[depth].read()
    if (dirent === null) {
      subDirs.pop()
      subPaths.pop()
      if (depth === 0) {
        return null
      } else {
        return next()
      }
    } else if (dirent.isDirectory()) {
      subPaths.push(dirent.name)
      const subDir = await fsPromise.opendir(subPaths.join('/'))
      subDirs.push(subDir)
      return next()
    } else if (dirent.isFile()) {
      return `${subPaths.slice(1).join('/')}/${dirent.name}`
    }
  }

  return {
    next,
  }
}
