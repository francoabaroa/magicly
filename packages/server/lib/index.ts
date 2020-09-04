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
    getPresignedUrl: (userId, bucketDocId) => Promise<any>;
    singleFileUploadResolver: () => Promise<any>;
    // singleFileUploadResolver: (file, me) => Promise<any>;
    // multipleUploadsResolver: (parent, { files }: { files: File[] }) => Promise<any>;
  }
}