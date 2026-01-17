import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  mapActivityTypeToEnum,
  mapTimeOfDayToEnum,
  mapDurationToEnum,
  mapSpecialToEnum,
  mapActivityTypeFromEnum,
  mapTimeOfDayFromEnum,
  mapDurationFromEnum,
  mapSpecialFromEnum,
} from "@/utils/filterMappers";

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
  
  // Filter parameters
  const activityTypesParam = searchParams.get("activityTypes");
  const timeOfDaysParam = searchParams.get("timeOfDays");
  const durationParam = searchParams.get("duration");
  const specialsParam = searchParams.get("specials");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const limit = Math.max(1, Math.min(Number(limitParam) || 12, 50));
  const page = Math.max(1, Number(pageParam) || 1);
  const skip = (page - 1) * limit;

  // Build where clause for filters
  const where: any = {};

  // Price range filter
  if (minPriceParam !== null || maxPriceParam !== null) {
    where.price = {};
    if (minPriceParam !== null) {
      where.price.gte = Number(minPriceParam);
    }
    if (maxPriceParam !== null) {
      where.price.lte = Number(maxPriceParam);
    }
  }

  // Activity types filter (using hasSome for array contains any)
  if (activityTypesParam) {
    const activityTypes = activityTypesParam.split(",").map(mapActivityTypeToEnum);
    where.activityTypes = { hasSome: activityTypes };
  }

  // Time of day filter
  if (timeOfDaysParam) {
    const timeOfDays = timeOfDaysParam.split(",").map(mapTimeOfDayToEnum);
    where.timeOfDays = { hasSome: timeOfDays };
  }

  // Duration filter
  if (durationParam && durationParam !== "null") {
    where.duration = mapDurationToEnum(durationParam as any);
  }

  // Specials filter
  if (specialsParam) {
    const specials = specialsParam.split(",").map(mapSpecialToEnum);
    where.specials = { hasSome: specials };
  }

  // Get total count for filtered results
  const totalCount = await prisma.experience.count({ where });

  // Calculate average and max price
  const priceStats = await prisma.experience.aggregate({
    where,
    _avg: { price: true },
    _max: { price: true },
  });
  const averagePrice = priceStats._avg.price ?? 0;
  const maxPrice = priceStats._max.price ?? 1000;

  const experiences = await prisma.experience.findMany({
    where,
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
      activityTypes: (rest.activityTypes || []).map(mapActivityTypeFromEnum),
      timeOfDays: (rest.timeOfDays || []).map(mapTimeOfDayFromEnum),
      duration: mapDurationFromEnum(rest.duration),
      specials: (rest.specials || []).map(mapSpecialFromEnum),
    };
  });

  return NextResponse.json({
    items: formatted,
    nextPage: hasMore ? page + 1 : null,
    hasMore,
    totalCount,
    averagePrice,
    maxPrice,
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
  const {
    title,
    location,
    price,
    rating,
    image,
    description,
    activityTypes,
    timeOfDays,
    duration,
    specials,
  } = body ?? {};

  if (!title || !location || !price || !rating || !image) {
    return NextResponse.json(
      { error: "Missing required fields: title, location, price, rating, image" },
      { status: 400 },
    );
  }

  // Map filter fields if provided
  const mappedActivityTypes = activityTypes
    ? (activityTypes as string[]).map(mapActivityTypeToEnum)
    : [];
  const mappedTimeOfDays = timeOfDays
    ? (timeOfDays as string[]).map(mapTimeOfDayToEnum)
    : [];
  const mappedDuration = duration ? mapDurationToEnum(duration as any) : null;
  const mappedSpecials = specials
    ? (specials as string[]).map(mapSpecialToEnum)
    : [];

  const experience = await prisma.experience.create({
    data: {
      title,
      location,
      price: Number(price),
      rating: Number(rating),
      image,
      description,
      activityTypes: mappedActivityTypes as any,
      timeOfDays: mappedTimeOfDays as any,
      duration: mappedDuration as any,
      specials: mappedSpecials as any,
      userId: session.user.id,
    },
  });

  return NextResponse.json(experience, { status: 201 });
}

