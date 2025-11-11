import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type ExperienceWithHost = {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  host: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const pageParam = searchParams.get("page");

  const limit = Math.max(1, Math.min(Number(limitParam) || 12, 50));
  const page = Math.max(1, Number(pageParam) || 1);
  const skip = (page - 1) * limit;

  const experiences = await prisma.experience.findMany({
    skip,
    take: limit + 1,
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

  const hasMore = experiences.length > limit;
  const limitedExperiences = hasMore ? experiences.slice(0, limit) : experiences;

  const formatted = limitedExperiences.map((experience: ExperienceWithHost) => {
    const { host, ...rest } = experience;
    return {
      ...rest,
      hostName: host?.name ?? null,
      hostImage: host?.image ?? null,
    };
  });

  return NextResponse.json({
    items: formatted,
    nextPage: hasMore ? page + 1 : null,
    hasMore,
  });
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

