import { S3 } from "aws-sdk";
import type { PathType } from "./s3-types";

type S3Error = {
  code: string;
  message: string;
  statusCode?: number;
  retryable?: boolean;
  time?: Date;
};

const s3 = new S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

// Define functions for interacting with S3
export const generatePresignedURL = (
  objectKey: PathType,
  expiration = 300,
): string => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: objectKey,
    Expires: expiration,
  };
  return s3.getSignedUrl("getObject", params);
};

export const hasObject = async (objectKey: PathType): Promise<boolean> => {
  const params: S3.HeadObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: objectKey,
  };

  try {
    await s3.headObject(params).promise();
    return true; // Object exists
  } catch (error) {
    if (typeof error !== "object" || error === null) throw error;

    const s3Error = error as S3Error;
    if (s3Error.code === "NotFound") return false;
    else throw error;
  }
};
