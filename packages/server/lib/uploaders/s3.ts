import S3 from 'aws-sdk/clients/s3';
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
  promise: Promise<S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader implements ApolloServerFileUploads.IUploader {
  private s3: S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    this.s3 = new S3(config);
    this.config = config;
  }

  private createUploadStream(key: string, userId: any, userEmail: any, mimetype: string): S3UploadStream {
    const pass = new stream.PassThrough();
    let hashedEmail = this.hashEmail(userEmail);
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.destinationBucketName + '/' + userId + hashedEmail,
          Key: key,
          ContentType: mimetype,
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

  private hashEmail(email: any) {
    let hash = 0;
    if (email.length == 0) {
      return hash;
    }
    for (let i = 0; i < email.length; i++) {
      let char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  async getPresignedUrl(userId: any, userEmail:any, bucketDocId: any): Promise<any> {
    let hashedEmail = this.hashEmail(userEmail);
    const params = {
      Bucket: this.config.destinationBucketName + '/' + userId + hashedEmail,
      Key: bucketDocId,
      Expires: 900
    };

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('getObject', params, function (err, url) {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    });
  }

  async singleFileUploadResolver(
    file: ApolloServerFileUploads.File,
    me: any
  ): Promise<ApolloServerFileUploads.UploadedFileResponse> {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const fileName = filename.split('.')[0];
    const fileEnding = filename.split('.')[1];
    const userId = me && me.id ? me.id : '';
    const dateString = new Date().getTime();
    const finalFileName =
      userId + '_' + dateString + '_' + fileName + '.' + fileEnding;
    const stream = createReadStream();
    const filePath = this.createDestinationFilePath(
      finalFileName,
      mimetype,
      encoding
    );
    const uploadStream = this.createUploadStream(filePath, me.id, me.email, mimetype);
    stream.pipe(uploadStream.writeStream);
    const result = await uploadStream.promise;
    return { filename: finalFileName, mimetype, encoding, url: result.Location };
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