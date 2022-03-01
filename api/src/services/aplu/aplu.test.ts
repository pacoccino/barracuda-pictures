import { arboDate, arboPath } from './aplu'
import { ArboPath } from 'types/graphql'

type NewArbo = {
  path: string | number
  count: number
  children: Record<string, NewArbo>
}

function arboToObject(arbo: ArboPath): NewArbo {
  return {
    path: arbo.path,
    count: arbo.count,
    children: arbo.children.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.path]: arboToObject(curr),
      }),
      {}
    ),
  }
}

describe('aplu', () => {
  scenario('arbo path', async (scenario) => {
    const root = await arboPath()
    const rootO = arboToObject(root)
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
    const root = await arboDate()
    const rootO = arboToObject(root)
    expect(rootO.path).toBe(0)
    expect(rootO.count).toEqual(Object.keys(scenario.image).length)
    expect(Object.keys(rootO.children).length).toEqual(3)

    expect(rootO.children[2001].path).toEqual(2001)
    expect(rootO.children[2001].count).toEqual(3)
    expect(Object.keys(rootO.children[2001].children).length).toEqual(2)
    expect(rootO.children[2001].children[0].count).toEqual(2)
    expect(rootO.children[2001].children[1].count).toEqual(1)
    expect(rootO.children[2002].count).toEqual(1)
    expect(rootO.children[2002].children[0].count).toEqual(1)
    expect(rootO.children[2004].count).toEqual(2)
    expect(rootO.children[2004].children[2].count).toEqual(2)
  })
})
