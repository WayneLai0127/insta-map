import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  NotFound,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { PathType } from "./s3-types";

const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  // aws-sdk v2 resolved the region from AWS_REGION / AMAZON_REGION and fell
  // back to us-east-1. v3 has no fallback, so keep the v2 resolution order.
  // AWS_S3_REGION (optional) takes precedence because AWS_REGION is reserved
  // on some hosts (e.g. Vercel) and may not match the bucket's region.
  region:
    [
      process.env.AWS_S3_REGION,
      process.env.AWS_REGION,
      process.env.AMAZON_REGION,
    ].find(Boolean) ?? "us-east-1",
  // v2 retried S3 calls against the bucket's real region on a region
  // redirect; v3 only does this when explicitly enabled.
  followRegionRedirects: true,
  // v2 fell back to the default credential provider chain when the explicit
  // keys were not set; v3 does the same when `credentials` is omitted.
  ...(accessKeyId && secretAccessKey
    ? { credentials: { accessKeyId, secretAccessKey } }
    : {}),
});

// Define functions for interacting with S3
export const generatePresignedURL = async (
  objectKey: PathType,
  expiration = 300,
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: objectKey,
  });
  return getSignedUrl(s3, command, { expiresIn: expiration });
};

export const hasObject = async (objectKey: PathType): Promise<boolean> => {
  const command = new HeadObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: objectKey,
  });

  try {
    await s3.send(command);
    return true; // Object exists
  } catch (error) {
    if (
      error instanceof NotFound ||
      (error instanceof S3ServiceException && error.name === "NotFound")
    )
      return false;
    throw error;
  }
};

export const listObjectsInFolder = async (
  folderPath: string,
  excludeFolders = true,
  excludeCurrentFolder = true,
): Promise<string[]> => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Prefix: folderPath,
  });

  const files: string[] = [];

  const data = await s3.send(command);
  if (data.Contents) {
    for (const object of data.Contents) {
      if (object.Key) {
        // Extract the file name from the full object key
        const fileName = object.Key.replace(`${folderPath}`, "");
        if (excludeFolders && fileName.split("/").length > 2) continue;
        if (excludeCurrentFolder && fileName === "/") continue;
        files.push(fileName);
      }
    }
  }
  return files;
};
