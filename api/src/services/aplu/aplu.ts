import type { ArboResponse } from 'types/graphql'
import { db } from 'src/lib/db'
import _ from 'lodash'
import S3Path from 'src/lib/files/S3Path'
import moment from 'moment'

export const arbo = async (): Promise<ArboResponse> => {
  const arboPath = {
    path: '/',
    count: 0,
    children: [],
  }
  const arboDate = {
    path: 0,
    count: 0,
    children: [],
  }

  const allImages = await db.image.findMany({
    select: {
      path: true,
      dateTaken: true,
    },
  })
  arboPath.count = allImages.length
  arboDate.count = allImages.length

  _.forEach(allImages, ({ path, dateTaken }) => {
    // Dates
    const date = moment(dateTaken)
    const year = date.year()
    const month = date.month()

    let yearArb = arboDate.children.find((c) => c.path === year)
    if (!yearArb) {
      yearArb = {
        path: year,
        count: 0,
        children: [],
      }
      arboDate.children.push(yearArb)
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

    // Paths

    const basePath = S3Path.getBasePath(path)
    const splitted = S3Path.splitPath(basePath)

    let currArbo = arboPath

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
  return {
    arboPath,
    arboDate,
  }
}
