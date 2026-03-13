import { Queue, Worker } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? "6379")
};

export const entitlementQueue = new Queue("entitlement-events", { connection });

export const entitlementWorker = new Worker(
  "entitlement-events",
  async (job) => {
    if (job.name === "sync-plan-state") {
      return { synced: true, at: new Date().toISOString() };
    }

    return { ignored: true };
  },
  { connection }
);

if (process.env.NODE_ENV !== "test") {
  entitlementWorker.on("completed", (job) => {
    console.log(`completed job ${job.id}`);
  });
}
