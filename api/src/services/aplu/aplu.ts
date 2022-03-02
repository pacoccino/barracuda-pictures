import type {
  ArboResponse,
  ArboPath,
  ArboDate,
  QueryarboArgs,
  QuerytagsFromFilterArgs,
} from 'types/graphql'
import { images } from 'src/services/images'
import _ from 'lodash'
import S3Path from 'src/lib/files/S3Path'
import moment from 'moment'
import { Tag } from '@prisma/client'
import { db } from 'src/lib/db'

// Advanced Picture Look Up

export const arbo = async ({
  filter,
}: QueryarboArgs = {}): Promise<ArboResponse> => {
  const arboPath: ArboPath = {
    path: '/',
    count: 0,
    children: [],
  }
  const arboDate: ArboDate = {
    path: 0,
    date: new Date().toISOString(),
    count: 0,
    children: [],
  }

  const allImages = await images(
    {
      filter,
      take: 0,
    },
    {
      select: {
        path: true,
        dateTaken: true,
      },
    }
  )
  arboPath.count = allImages.length
  arboDate.count = allImages.length

  _.forEach(allImages, ({ path, dateTaken }) => {
    // Dates
    const date = moment(dateTaken)

    // Year
    const year = date.year()
    let yearArb = arboDate.children.find((c) => c.path === year)
    if (!yearArb) {
      yearArb = {
        path: year,
        date: moment.utc([year]).toISOString(),
        count: 0,
        children: [],
      }
      arboDate.children.push(yearArb)
    }
    yearArb.count++

    // Month
    const month = date.month()
    let monthArb = yearArb.children.find((c) => c.path === month)
    if (!monthArb) {
      monthArb = {
        path: month,
        date: moment.utc([year, month]).toISOString(),
        count: 0,
        children: [],
      }
      yearArb.children.push(monthArb)
    }
    monthArb.count++
    // Day
    const day = date.date()
    let dayArbo = monthArb.children.find((c) => c.path === day)
    if (!dayArbo) {
      dayArbo = {
        path: day,
        date: moment.utc([year, month, day]).toISOString(),
        count: 0,
        children: [],
      }
      monthArb.children.push(dayArbo)
    }
    dayArbo.count++

    // Paths

    const basePath = S3Path.getBasePath(path)
    const splitted = S3Path.splitPath(basePath)

    let currArbo = arboPath

    _.forEach(splitted, (subPath) => {
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

export const tagsFromFilter = async ({
  filter,
}: QuerytagsFromFilterArgs = {}): Promise<Tag[]> => {
  const allImages = await images(
    {
      filter,
      take: 0,
    },
    {
      select: {
        id: true,
      },
    }
  )

  return db.tag.findMany({
    where: {
      tagsOnImages: {
        some: {
          OR: allImages.map((image) => ({
            imageId: image.id,
          })),
        },
      },
    },
  })
}
