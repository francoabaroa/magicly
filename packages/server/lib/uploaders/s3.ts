import AWS from 'aws-sdk';
import stream from 'stream';
import { ApolloServerFileUploads } from '../index';
require('dotenv').config({ path: '../../../.env' });

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  destinationBucketName: string;
};

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader implements ApolloServerFileUploads.IUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.region || process.env.AWS_DEFAULT_REGION ||'us-east-1',

      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    });

    this.s3 = new AWS.S3();
    this.config = config;
  }

  private createUploadStream(key: string, userId: any): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.destinationBucketName + '/' + userId,
          Key: key,
          Body: pass
        })
        .promise()
    };
  }

  private createDestinationFilePath(
    fileName: string,
    mimetype: string,
    encoding: string
  ): string {
    return fileName;
  }

  async singleFileUploadResolver(
    file: ApolloServerFileUploads.File,
    me: any
  ): Promise<ApolloServerFileUploads.UploadedFileResponse> {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const stream = createReadStream();
    const filePath = this.createDestinationFilePath(
      filename,
      mimetype,
      encoding
    );
    const uploadStream = this.createUploadStream(filePath, me.id);
    stream.pipe(uploadStream.writeStream);
    const result = await uploadStream.promise;
    return { filename, mimetype, encoding, url: result.Location };
  }

  async multipleUploadsResolver(
    parent,
    { files }: { files: ApolloServerFileUploads.File[] }
  ): Promise<ApolloServerFileUploads.UploadedFileResponse[]> {
    // TODO: before using, change 0 to me.id
    return Promise.all(
      files.map(f => this.singleFileUploadResolver(f, 0))
    );
  }
}