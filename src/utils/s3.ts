import { S3 } from "aws-sdk";

type Buckets = "post" | "instagram-user";
type Id = number; // Assuming id is a string
type ImageSizes = "sm" | "md" | "lg";
type ImageTypes = ".png" | ".jpg" | ".jpeg";

type ImagePathTypes = `image/${Buckets}/${ImageSizes}/${Id}${ImageTypes}`;
type PathTypes = ImagePathTypes; // add more when more file buckets are needed

type S3Error = {
  code: string;
  message: string;
  statusCode?: number;
  retryable?: boolean;
  time?: Date;
};

const s3 = new S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

// Define functions for interacting with S3
export const generatePresignedURL = (
  objectKey: PathTypes,
  expiration = 300,
): string => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: objectKey,
    Expires: expiration,
  };
  return s3.getSignedUrl("getObject", params);
};

export const hasObject = async (objectKey: PathTypes): Promise<boolean> => {
  const params: S3.HeadObjectRequest = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
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
