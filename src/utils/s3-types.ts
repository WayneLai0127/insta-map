const buckets = ["post", "instagram-user"] as const;
const imageSizes = ["sm", "md", "lg"] as const;
const imageFileTypes = [".png", ".jpg", ".jpeg"] as const;

type Bucket = (typeof buckets)[number];
type ImageSize = (typeof imageSizes)[number];
type Id = number;
type ImageFileType = (typeof imageFileTypes)[number];

type ImageFolderType = `image/${Bucket}/${ImageSize}`;
type UserImagePathType =
  `image/instagram-user/${ImageSize}/${Id}${ImageFileType}`;
type PostImagePathType = `image/post/${ImageSize}/${Id}/${Id}${ImageFileType}`;

type FolderType = ImageFolderType; // add more when more file buckets are needed
type PathType = UserImagePathType | PostImagePathType; // add more when more file buckets are needed

export { buckets, imageSizes, imageFileTypes };

export type {
  Bucket,
  ImageSize,
  Id,
  ImageFileType,
  ImageFolderType,
  FolderType,
  PathType,
};
