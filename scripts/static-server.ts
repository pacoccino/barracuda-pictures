import { staticServer } from 'api/src/lib/static'

export default async () => {
  const path = './data/static'
  staticServer(path)
}
