import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  width,
  height,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {isLoading && (
        <Skeleton
          className="h-5 w-5 rounded-full"
          style={{ marginTop: `${width}px` }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ width: width, height: height }}
        className="rounded-full"
        onLoadingComplete={handleImageLoad}
      />
    </div>
  );
};

export default ImageWithSkeleton;
