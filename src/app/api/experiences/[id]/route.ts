import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await prisma.experience.findUnique({
    where: { id },
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

  if (!experience) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  const { host, ...rest } = experience;

  return NextResponse.json({
    ...rest,
    hostName: host?.name ?? null,
    hostImage: host?.image ?? null,
  });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (session.user.role !== "HOST") {
    return NextResponse.json({ error: "Only hosts can update experiences" }, { status: 403 });
  }

  const existing = await prisma.experience.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "You can only update your own experiences" }, { status: 403 });
  }

  const body = await req.json();
  const { title, location, price, rating, image, description } = body ?? {};

  const updated = await prisma.experience.update({
    where: { id },
    data: {
      title,
      location,
      price: price !== undefined ? Number(price) : undefined,
      rating: rating !== undefined ? Number(rating) : undefined,
      image,
      description,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (session.user.role !== "HOST") {
    return NextResponse.json({ error: "Only hosts can delete experiences" }, { status: 403 });
  }

  const existing = await prisma.experience.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "You can only delete your own experiences" }, { status: 403 });
  }

  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}

