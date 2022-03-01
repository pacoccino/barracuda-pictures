import { arbo } from './aplu'
import { ArboPath, ArboDate } from 'types/graphql'

type NewArbo = {
  path: string | number
  count: number
  children: Record<string, NewArbo>
}

function arboToObject<T = ArboPath | ArboDate>(arbo: T): NewArbo {
  return {
    path: arbo.path,
    count: arbo.count,
    children: arbo.children.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.path]: arboToObject<T>(curr),
      }),
      {}
    ),
  }
}

describe('aplu', () => {
  scenario('arbo path', async (scenario) => {
    const root = await arbo()
    const rootO = arboToObject<ArboPath>(root.arboPath)
    expect(rootO.path).toBe('/')
    expect(rootO.count).toEqual(Object.keys(scenario.image).length)
    expect(Object.keys(rootO.children).length).toEqual(2)

    expect(rootO.children.ath1.path).toEqual('ath1')
    expect(rootO.children.ath1.count).toEqual(2)
    expect(Object.keys(rootO.children.ath1.children).length).toEqual(1)
    expect(rootO.children.ath1.children.ath2.path).toEqual('ath2')
    expect(rootO.children.ath1.children.ath2.count).toEqual(1)
    expect(rootO.children.ath3.path).toEqual('ath3')
    expect(rootO.children.ath3.count).toEqual(1)
  })

  scenario('arbo date', async (scenario) => {
    const root = await arbo()
    const rootO = arboToObject<ArboDate>(root.arboDate)
    expect(rootO.path).toBe(0)
    expect(rootO.count).toEqual(Object.keys(scenario.image).length)
    expect(Object.keys(rootO.children).length).toEqual(3)

    expect(rootO.children[2001].path).toEqual(2001)
    expect(rootO.children[2001].count).toEqual(3)
    expect(Object.keys(rootO.children[2001].children).length).toEqual(2)
    expect(rootO.children[2001].children[0].count).toEqual(2)
    expect(rootO.children[2001].children[0].children[1].count).toEqual(2)
    expect(rootO.children[2001].children[1].count).toEqual(1)
    expect(rootO.children[2001].children[1].children[2].count).toEqual(1)
    expect(rootO.children[2002].count).toEqual(1)
    expect(rootO.children[2002].children[0].count).toEqual(1)
    expect(rootO.children[2004].count).toEqual(2)
    expect(rootO.children[2004].children[2].count).toEqual(2)
  })
})
