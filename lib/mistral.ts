import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
  throw new Error("MISTRAL_API_KEY is not defined");
}
const client = new Mistral({ apiKey: apiKey });

export async function imageOCR(imageUrl: string) {
  return await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
      type: "image_url",
      imageUrl,
    },
    includeImageBase64: true,
  });
}
