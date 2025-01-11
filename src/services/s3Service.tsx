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
  { name: 'horse.jpg', filePath: '/images/horse.jpg' },
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

