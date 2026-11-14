const MODULES_JSON = "https://cre.butowsky.com/modules.json";
const FALLBACK_LABEL = "Open the free lessons";

export function lessonCtaLabel(count: unknown): string {
  if (typeof count !== "number" || !Number.isSafeInteger(count)) {
    return FALLBACK_LABEL;
  }
  if (count < 1 || count > 99) return FALLBACK_LABEL;
  if (count === 1) return "Open the free lesson";
  return `Open all ${count} free lessons`;
}

function countFromPayload(payload: unknown): unknown {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return undefined;
  }
  if (!("count" in payload)) return undefined;
  return payload.count;
}

export async function getLessonCtaLabel(): Promise<string> {
  try {
    const response = await fetch(MODULES_JSON, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return lessonCtaLabel(undefined);
    const payload: unknown = await response.json();
    return lessonCtaLabel(countFromPayload(payload));
  } catch {
    return lessonCtaLabel(undefined);
  }
}
