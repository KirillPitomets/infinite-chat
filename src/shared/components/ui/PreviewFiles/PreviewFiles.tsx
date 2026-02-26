import Image from "next/image"
import React from "react"
import { PreviewFile } from "./PreviewFile.types"

type PreviewFilesProps = {
  files: PreviewFile[]
  removeFile: (filename: string) => void
}

export const PreviewFiles = ({ files, removeFile }: PreviewFilesProps) => {
  return (
    <ul className="flex flex-wrap">
      {files.map(item => (
        <li key={item.file.name} className="flex gap-4">
          {item.isImg ? (
            <img
              className="max-w-[200px] max-h-[290px] object-contain"
              src={item.preview}
              alt={item.file.name}
            />
          ) : (
            <div>Some File ;D</div>
          )}
          <button
            className="cursor-pointer"
            onClick={() => removeFile(item.file.name)}
          >
            X
          </button>
        </li>
      ))}
    </ul>
  )
}

/*
import React, { useState } from 'react';

const ImageDimensionReader = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      // Create a URL for the file
      const objectUrl = URL.createObjectURL(file);

      // Create a new Image object programmatically
      const img = new Image();

      // Set the onload event handler to get dimensions once the image is loaded
      img.onload = () => {
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        // Clean up the object URL after getting the dimensions
        URL.revokeObjectURL(objectUrl);
      };

      // Set the image source to the object URL to start loading
      img.src = objectUrl;

      // Handle potential errors during image loading
      img.onerror = () => {
        console.error("Error loading image");
        URL.revokeObjectURL(objectUrl);
      };

    } else {
      setFileName('');
      setDimensions({ width: 0, height: 0 });
      alert("Please select a valid image file.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {fileName && (
        <p>
          File: {fileName} <br />
          Dimensions: {dimensions.width}px (width) x {dimensions.height}px (height)
        </p>
      )}
    </div>
  );
};

export default ImageDimensionReader;

*/
