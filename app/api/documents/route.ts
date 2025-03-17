import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { imageOCR } from "@/lib/mistral";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const imageFile = formData.get("image") as File;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Generate a unique filename using timestamp and random string
    const fileExtension = imageFile.name.split(".").pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}-${randomStr}.${fileExtension}`;
    const ocrResponse = await imageOCR(imageFile);

    // Create a new document in the database
    const document = await prisma.document.create({
      data: {
        title,
        imagePath: `/uploads/${fileName}`,
        ocrResult: ocrResponse.pages
          .map((page) => {
            return page.markdown;
          })
          .join("\n---\n"),
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
