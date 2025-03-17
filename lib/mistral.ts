import { Mistral } from "@mistralai/mistralai";
import { S3Client, randomUUIDv7 } from "bun";

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
  throw new Error("MISTRAL_API_KEY is not defined");
}
const minstral = new Mistral({ apiKey: apiKey });
const s3Client = new S3Client({
  accessKeyId: process.env.GCS_ACCESS_KEY_ID,
  secretAccessKey: process.env.GCS_SECRET_ACCESS_KEY,
  bucket: process.env.GCS_BUCKET,
  endpoint: "https://storage.googleapis.com",
});

async function uploadFileToS3(file: File) {
  const uniqueID = randomUUIDv7();
  const s3File = s3Client.file(uniqueID);
  await s3File.write(file);
  const url = s3File.presign({
    expiresIn: 60 * 60, // 1 hour
    method: "GET",
    type: file.type,
  });
  return url;
}

export async function imageOCR(file: File) {
  return await minstral.ocr.process({
    model: "mistral-ocr-latest",
    document: {
      type: "image_url",
      imageUrl: await uploadFileToS3(file),
    },
    includeImageBase64: true,
  });
}
