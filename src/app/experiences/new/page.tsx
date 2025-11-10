import { redirect } from "next/navigation";
import ExperienceForm from "@/components/ExperienceForm";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewExperiencePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/experiences/new");
  }

  if (session.user.role !== "HOST") {
    redirect("/experiences");
  }

  return <ExperienceForm />;
}


