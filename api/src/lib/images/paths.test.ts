import { getBasePath, getFileName, getPath } from 'src/lib/images/paths'

describe('paths', () => {
  it('getBasePath', () => {
    expect(getBasePath('a/a.jpg')).toEqual('a')
    expect(getBasePath('coucou/caca/a.jpg')).toEqual('coucou/caca')
    expect(getBasePath('a/b/c/d/e/a.jpg')).toEqual('a/b/c/d/e')
    expect(getBasePath('a.jpg')).toEqual('')
    expect(getBasePath('a//a.jpg')).toEqual('a')
    expect(getBasePath('/a/b/he.jpg')).toEqual('a/b')
    expect(getBasePath('/a/b/he')).toEqual('a/b')
  })
  it('getFileName', () => {
    expect(getFileName('a/a.jpg')).toEqual('a.jpg')
    expect(getFileName('coucou/caca/a.jpg')).toEqual('a.jpg')
    expect(getFileName('coucou/caca/df/fds/ds/a.jpg')).toEqual('a.jpg')
    expect(getFileName('a//a.jpg')).toEqual('a.jpg')
  })
  it('getPath', () => {
    expect(getPath('a', 'b.zip')).toEqual('a/b.zip')
    expect(getPath('a/b', 'b.zip')).toEqual('a/b/b.zip')
    expect(getPath('a/b/', 'b.zip')).toEqual('a/b/b.zip')
    expect(getPath('/', 'b.zip')).toEqual('b.zip')
  })
})
