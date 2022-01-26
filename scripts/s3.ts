import { S3Lib } from 'api/src/lib/s3'

export default async () => {
  const res1 = await S3Lib.list('fs/a')
  console.log(res1)
  const res2 = await S3Lib.get('fs/a/a.JPG')
  console.log(res2)
}
