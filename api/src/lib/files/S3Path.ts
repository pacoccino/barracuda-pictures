export default {
  getBasePath(path: string) {
    const basePath = path
      .split('/')
      .filter((p) => p !== '')
      .slice(0, -1)
      .join('/')

    return basePath
  },

  getFileName(path: string) {
    const fileName = path.split('/').slice(-1)[0]

    return fileName
  },

  getPath(basePath: string | undefined | null, fileName: string) {
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
  },
}
