import { listS3 } from 'api/src/lib/s3'

export default async () => {
  const res1 = await listS3('fs/a')
  console.log(res1)
}
