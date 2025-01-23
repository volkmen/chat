import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const secretAccessKey = process.env.AWS_S3_SECRET_KEY;
const accessKeyId = process.env.AWS_S3_ACCESS_ID;
const bucketName = process.env.AWS_S3_IMAGES_BUCKET;
const region = 'us-east-1';
const randomBytesPromise = promisify(randomBytes);

export class S3Provider {
  protected s3Client: S3Client;

  constructor() {
    this.connect();
  }

  protected connect() {
    this.s3Client = new S3Client([
      {
        region
        // credentials: {
        //   accessKeyId,
        //   secretAccessKey
        // }
      }
    ]);
  }

  async generateS3PutObject(ContentType: string) {
    const hashKey = await randomBytesPromise(16).then(arr => arr.toString('hex'));

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: hashKey,
      ContentType
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 300 });
  }
}
