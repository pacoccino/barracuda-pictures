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
    const listObjects = promisify(this.client, 'listObjects')
    let keys = []
    let isTruncated = true

    while (isTruncated) {
      const Marker = keys.length > 0 ? keys[keys.length - 1] : undefined
      const res = await listObjects({
        ...params,
        Marker,
      })
      isTruncated = res.IsTruncated
      keys = keys.concat(res.Contents.map((c) => c.Key))
    }

    return keys
  }

  async get(Key: string, Range?: string): Promise<Buffer | null> {
    const params = {
      Bucket: this.bucket,
      Key,
      Range,
    }
    try {
      const res = await promisify(this.client, 'getObject')(params)
      return res.Body
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        return null
      } else {
        throw error
      }
    }
  }

  async head(Key: string): Promise<S3.Types.HeadObjectOutput> {
    const params = {
      Bucket: this.bucket,
      Key,
    }
    try {
      const res = await promisify(this.client, 'headObject')(params)
      return res
    } catch (error) {
      if (error.code === 'NotFound') {
        return null
      } else {
        throw error
      }
    }
  }

  async delete(Key: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key,
    }
    await promisify(this.client, 'deleteObject')(params)
  }

  async deletePrefix(Prefix?: string): Promise<void> {
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
  async editKey(oldKey: string, newKey: string): Promise<void> {
    const copyParams = {
      Bucket: this.bucket,
      Key: newKey,
      CopySource: `${this.bucket}/${oldKey}`,
    }
    await promisify(this.client, 'copyObject')(copyParams)
    await this.delete(oldKey)
  }
}

export const Buckets = {
  photos: new S3Lib(
    `${process.env['S3_BUCKET_PHOTOS']}${
      process.env['NODE_ENV'] === 'test' ? '-test' : ''
    }`
  ),
  miniatures: new S3Lib(
    `${process.env['S3_BUCKET_MINIATURES']}${
      process.env['NODE_ENV'] === 'test' ? '-test' : ''
    }`
  ),
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
