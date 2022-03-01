import type { ArboPath, ArboDate } from 'types/graphql'
import { db } from 'src/lib/db'
import _ from 'lodash'
import S3Path from 'src/lib/files/S3Path'
import moment from 'moment'

export const arboPath = async (): Promise<ArboPath> => {
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

export const arboDate = async (): Promise<ArboDate> => {
  const root = {
    path: 0,
    count: 0,
    children: [],
  }

  const allImages = await db.image.findMany({
    select: {
      dateTaken: true,
    },
  })
  root.count = allImages.length

  _.forEach(allImages, ({ dateTaken }) => {
    const date = moment(dateTaken)
    const year = date.year()
    const month = date.month()

    let yearArb = root.children.find((c) => c.path === year)
    if (!yearArb) {
      yearArb = {
        path: year,
        count: 0,
        children: [],
      }
      root.children.push(yearArb)
    }
    yearArb.count++

    let monthArb = yearArb.children.find((c) => c.path === month)
    if (!monthArb) {
      monthArb = {
        path: month,
        count: 0,
        children: [],
      }
      yearArb.children.push(monthArb)
    }
    monthArb.count++
  })
  return root
}
