import Site from "@/components/Site";
import { getLessonCtaLabel } from "@/lib/lessons";

export const revalidate = 3600;

export default async function Page() {
  const lessonLabel = await getLessonCtaLabel();
  return <Site lessonLabel={lessonLabel} />;
}
