import { PublicScheduler } from "@/components/public-scheduler";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <PublicScheduler
      query={{
        service: typeof params.service === "string" ? params.service : undefined,
        date: typeof params.date === "string" ? params.date : undefined,
        mode: params.mode === "multi" ? "multi" : "single",
      }}
    />
  );
}
