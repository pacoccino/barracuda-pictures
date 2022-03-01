import type { ArboPath } from 'types/graphql'
import { db } from 'src/lib/db'
import _ from 'lodash'
import S3Path from 'src/lib/files/S3Path'

export const arbo = async (): Promise<ArboPath> => {
  const root = {
    path: '/',
    count: 0,
    children: [],
  }

  const allImages = await db.image.findMany({
    select: {
      path: true,
    },
  })
  root.count = allImages.length

  _.forEach(allImages, ({ path }) => {
    const basePath = S3Path.getBasePath(path)
    const splitted = S3Path.splitPath(basePath)

    let currArbo = root
    if (splitted.length === 0) return

    _.forEach(splitted, (subPath, i) => {
      let subArbo = currArbo.children.find((a) => a.path === subPath)
      if (!subArbo) {
        subArbo = {
          path: subPath,
          count: 0,
          children: [],
        }
        currArbo.children.push(subArbo)
      }
      currArbo = subArbo
      currArbo.count++
    })
  })
  return root
}
