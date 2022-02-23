export function getBasePath(path: string) {
  const basePath = path
    .split('/')
    .filter((p) => p !== '')
    .slice(0, -1)
    .join('/')

  return basePath
}

export function getFileName(path: string) {
  const fileName = path.split('/').slice(-1)[0]

  return fileName
}

export function getPath(basePath: string | undefined | null, fileName: string) {
  let cleanBasePath = basePath || ''
  if (cleanBasePath.length > 0 && cleanBasePath.slice(-1) === '/') {
    cleanBasePath = cleanBasePath.slice(0, -1)
  }

  let path = ''
  if (cleanBasePath.length > 0) {
    path = cleanBasePath + '/'
  }
  path = path + fileName

  return path
}
