import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The file name
 * @param {string} contentType - The file content type
 * @returns {Promise<string>} - The URL of the uploaded file
 */
export async function uploadFileToS3(fileBuffer, fileName, contentType) {
  const key = `uploads/${Date.now()}-${fileName}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));

    // Generate a signed URL for the uploaded file
    const getObjectParams = {
      Bucket: bucketName,
      Key: key,
    };

    // URL expires in 1 week
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand(getObjectParams),
      { expiresIn: 604800 }
    );

    return signedUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}
