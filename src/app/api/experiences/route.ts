import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const experiences = await prisma.experience.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const formatted = experiences.map(({ host, ...experience }) => ({
    ...experience,
    hostName: host?.name ?? null,
    hostImage: host?.image ?? null,
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (session.user.role !== "HOST") {
    return NextResponse.json({ error: "Only hosts can create experiences" }, { status: 403 });
  }

  const body = await req.json();
  const { title, location, price, rating, image, description } = body ?? {};

  if (!title || !location || !price || !rating || !image) {
    return NextResponse.json(
      { error: "Missing required fields: title, location, price, rating, image" },
      { status: 400 },
    );
  }

  const experience = await prisma.experience.create({
    data: {
      title,
      location,
      price: Number(price),
      rating: Number(rating),
      image,
      description,
      userId: session.user.id,
    },
  });

  return NextResponse.json(experience, { status: 201 });
}

