import { arbo } from './aplu'
import { ArboPath } from 'types/graphql'

type NewArbo = {
  path: string
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
  scenario('arbo', async (scenario) => {
    const root = await arbo()
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
})
