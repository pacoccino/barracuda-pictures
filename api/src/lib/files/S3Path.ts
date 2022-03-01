const S3Path = {
  getBasePath(path: string) {
    const splitted = S3Path.splitPath(path)
    const basePath = splitted.slice(0, -1).join('/')

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

  splitPath(path: string) {
    const splitted = path.split('/').filter((p) => p !== '')

    return splitted
  },
}

export default S3Path
