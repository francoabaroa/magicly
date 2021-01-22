import { ReadStream } from "fs";

export namespace ApolloServerFileUploads {

  export type File = {
    filename: string;
    mimetype: string;
    encoding: string;
    // TODO: add type ReadStream || stream.Readable
    createReadStream?: any;
  }

  export type UploadedFileResponse = {
    filename: string;
    mimetype: string;
    encoding: string;
    url: string;
  }

  export interface IUploader {
    getPresignedUrl: (userId, userEmail, bucketDocId) => Promise<any>;
    deleteFile: (userId, userEmail, bucketDocId) => Promise<any>;
    singleFileUploadResolver: (file, me) => Promise<UploadedFileResponse>;
    multipleUploadsResolver: (parent, { files }: { files: File[] }) => Promise<UploadedFileResponse[]>;
  }
}