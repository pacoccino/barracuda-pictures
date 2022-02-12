import { S3 } from 'aws-sdk'

const s3 = new S3({
  region: 'local',
  endpoint: process.env['S3_URL'],
  accessKeyId: process.env['S3_ACCESS_KEY'],
  secretAccessKey: process.env['S3_SECRET_KEY'],
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4',
})

const promisify =
  (fn) =>
  (params): ReturnType<typeof fn> => {
    return new Promise((resolve, reject) => {
      fn.bind(s3)(params, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

export const S3Lib = {
  async list(Prefix?: string): Promise<string[]> {
    const params = {
      Bucket: process.env['S3_BUCKET_NAME'],
      Prefix,
    }
    const res = await promisify(s3.listObjects)(params)
    return res.Contents.map((c) => c.Key)
  },

  async get(Key: string, Range?: string): Promise<Buffer> {
    const params = {
      Bucket: process.env['S3_BUCKET_NAME'],
      Key,
      Range,
    }
    const res = await promisify(s3.getObject)(params)
    return res.Body
  },
  async head(Key: string): Promise<S3.Types.HeadObjectOutput> {
    const params = {
      Bucket: process.env['S3_BUCKET_NAME'],
      Key,
    }
    const res = await promisify(s3.headObject)(params)
    return res
  },
  async delete(Key: string): Promise<void> {
    const params = {
      Bucket: process.env['S3_BUCKET_NAME'],
      Key,
    }
    await promisify(s3.deleteObject)(params)
  },
  async put(Key: string, Object: string): Promise<void> {
    const params = {
      Bucket: process.env['S3_BUCKET_NAME'],
      Key,
      Object,
    }
    await promisify(s3.putObject)(params)
  },
  async update(Key: string, Object: string): Promise<void> {
    const params = {
      Bucket: process.env['S3_BUCKET_NAME'],
      Key,
      Object,
    }
    await promisify(s3.putObject)(params)
  },
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
