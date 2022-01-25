import { S3 } from 'aws-sdk'

const s3 = new S3({
  region: 'local',
  endpoint: process.env['S3_URL'],
  accessKeyId: process.env['S3_ACCESS_KEY'],
  secretAccessKey: process.env['S3_SECRET_KEY'],
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4',
})

const promiseSimple = (resolve, reject) => (err, res) => {
  if (err) {
    reject(err)
  } else {
    resolve(res)
  }
}
export async function listS3(prefix) {
  return new Promise((resolve, reject) => {
    const bucketParams = {
      Bucket: process.env['S3_BUCKET_NAME'],
      Prefix: prefix,
    }
    s3.listObjects(bucketParams, promiseSimple(resolve, reject))
  })
}

/*
import { Client } from 'minio'

export const minioClient = new Client({
  endPoint: process.env['S3_URL'],
  port: 9000,
  useSSL: false,
  accessKey: process.env['S3_ACCESS_KEY'],
  secretKey: process.env['S3_SECRET_KEY'],
})

export function listS3(prefix) {
  return new Promise((resolve, reject) => {
    const stream = minioClient.extensions.listObjectsV2WithMetadata(
      process.env['S3_BUCKET_NAME'],
      prefix,
      true
    )
    stream.on('data', resolve)
    stream.on('error', reject)
  })
}
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3' // ES Modules import
import type {
  S3ClientConfig,
  ListObjectsCommandInput,
} from '@aws-sdk/client-s3'

const config: S3ClientConfig = {
  region: 'local',
  endpoint: process.env['S3_URL'],
  credentials: {
    accessKeyId: process.env['S3_ACCESS_KEY'],
    secretAccessKey: process.env['S3_SECRET_KEY'],
  },
}
const client = new S3Client(config)

export async function listS3(prefix) {
  const input: ListObjectsCommandInput = {
    Bucket: process.env['S3_BUCKET_NAME'],
    Prefix: prefix,
  }
  const command = new ListObjectsCommand(input)
  const response = await client.send(command)

  return response
}

*/
