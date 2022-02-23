import S3Path from 'src/lib/files/S3Path'

describe('paths', () => {
  it('getBasePath', () => {
    expect(S3Path.getBasePath('a/a.jpg')).toEqual('a')
    expect(S3Path.getBasePath('coucou/caca/a.jpg')).toEqual('coucou/caca')
    expect(S3Path.getBasePath('a/b/c/d/e/a.jpg')).toEqual('a/b/c/d/e')
    expect(S3Path.getBasePath('a.jpg')).toEqual('')
    expect(S3Path.getBasePath('a//a.jpg')).toEqual('a')
    expect(S3Path.getBasePath('/a/b/he.jpg')).toEqual('a/b')
    expect(S3Path.getBasePath('/a/b/he')).toEqual('a/b')
  })
  it('getFileName', () => {
    expect(S3Path.getFileName('a/a.jpg')).toEqual('a.jpg')
    expect(S3Path.getFileName('coucou/caca/a.jpg')).toEqual('a.jpg')
    expect(S3Path.getFileName('coucou/caca/df/fds/ds/a.jpg')).toEqual('a.jpg')
    expect(S3Path.getFileName('a//a.jpg')).toEqual('a.jpg')
  })
  it('getPath', () => {
    expect(S3Path.getPath('a', 'b.zip')).toEqual('a/b.zip')
    expect(S3Path.getPath('a/b', 'b.zip')).toEqual('a/b/b.zip')
    expect(S3Path.getPath('a/b/', 'b.zip')).toEqual('a/b/b.zip')
    expect(S3Path.getPath('/', 'b.zip')).toEqual('b.zip')
  })
})
