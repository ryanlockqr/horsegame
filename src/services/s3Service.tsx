import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure AWS SDK (make sure your credentials are set up)
const s3Client = new S3Client({
  region: "your-region", // Replace with your AWS region
  credentials: {
    accessKeyId: "your-access-key-id", // Replace with your Access Key ID
    secretAccessKey: "your-secret-access-key", // Replace with your Secret Access Key
  },
});

// List of horse images to upload
const horseImages = [
  { name: 'horse1.jpg', filePath: '/path_to_images/horse1.jpg' },
  { name: 'horse2.jpg', filePath: '/path_to_images/horse2.jpg' },
  { name: 'horse3.jpg', filePath: '/path_to_images/horse3.jpg' },
  { name: 'horse4.jpg', filePath: '/path_to_images/horse4.jpg' },
  { name: 'horse5.jpg', filePath: '/path_to_images/horse5.jpg' },
];

// Function to upload horse images to S3
export async function uploadHorseImages() {
  try {
    for (const image of horseImages) {
      const fileContent = await fetch(image.filePath).then(res => res.blob()); // Fetch the image file content
      const uploadParams = {
        Bucket: "myhorse", // Replace with your bucket name
        Key: `horsekins/${image.name}`, // Path within your bucket
        Body: fileContent,
        ContentType: "image/jpeg", // Content type of the file
      };

      const command = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(command);
      console.log(`Successfully uploaded ${image.name}:`, data);
    }
  } catch (error) {
    console.error("Error uploading images:", error);
  }
}

