import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const experiences = await prisma.experience.findMany();
  return NextResponse.json(experiences);
}

export async function POST(req: Request) {
  const body = await req.json();
  const experience = await prisma.experience.create({ data: body });
  return NextResponse.json(experience, { status: 201 });
}

