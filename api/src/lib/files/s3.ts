import { S3 } from 'aws-sdk'
import { ReadStream } from 'fs'

const promisify =
  (lib, fnName) =>
  (params): ReturnType<typeof lib['fnName']> => {
    return new Promise((resolve, reject) => {
      lib[fnName].bind(lib)(params, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

export class S3Lib {
  bucket: string
  client: S3

  constructor(bucket: string) {
    this.client = new S3({
      region: 'local',
      endpoint: process.env['S3_URL'],
      accessKeyId: process.env['S3_ACCESS_KEY'],
      secretAccessKey: process.env['S3_SECRET_KEY'],
      s3ForcePathStyle: true, // needed with minio?
      signatureVersion: 'v4',
    })
    this.bucket = bucket
  }

  async list(Prefix?: string): Promise<string[]> {
    const params = {
      Bucket: this.bucket,
      Prefix,
    }
    const res = await promisify(this.client, 'listObjects')(params)
    return res.Contents.map((c) => c.Key)
  }

  async get(Key: string, Range?: string): Promise<Buffer> {
    const params = {
      Bucket: this.bucket,
      Key,
      Range,
    }
    const res = await promisify(this.client, 'getObject')(params)
    return res.Body
  }

  async head(Key: string): Promise<S3.Types.HeadObjectOutput> {
    const params = {
      Bucket: this.bucket,
      Key,
    }
    const res = await promisify(this.client, 'headObject')(params)
    return res
  }

  async delete(Key: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key,
    }
    await promisify(this.client, 'deleteObject')(params)
  }

  async deletePrefix(Prefix: string): Promise<void> {
    const list = await this.list(Prefix)
    if (list.length === 0) return
    const params = {
      Bucket: this.bucket,
      Delete: {
        Objects: list.map((i) => ({ Key: i })),
      },
    }
    await promisify(this.client, 'deleteObjects')(params)
  }

  async put(
    Key: string,
    Body: string | Buffer | ReadStream,
    Metadata?: Record<string, string>,
    ContentType?: string
  ): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key,
      Body,
      Metadata,
      ContentType,
    }
    await promisify(this.client, 'putObject')(params)
  }
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
      this.bucket,
      prefix,
      true
    )
    stream.on('data', resolve)
    stream.on('error', reject)
  })
}
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-this.client' // ES Modules import
import type {
  S3ClientConfig,
  ListObjectsCommandInput,
} from '@aws-sdk/client-this.client'

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
    Bucket: this.bucket,
    Prefix: prefix,
  }
  const command = new ListObjectsCommand(input)
  const response = await client.send(command)

  return response
}

*/
