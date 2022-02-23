import fpath from 'path'

export const ACCEPTED_EXTENSIONS = ['jpg', 'jpg', 'png', 'webp', 'tif']
export const EXCLUDED_FILES = ['.DS_Store', 'Icon', 'Thumbs.db']

export function isPathExcluded(path: string) {
  const parsed = fpath.parse(path)

  if (EXCLUDED_FILES.includes(parsed.base)) return true

  return false
}

export function isFileTypeExcluded(ext: string) {
  if (!ACCEPTED_EXTENSIONS.includes(ext)) return true

  return false
}
