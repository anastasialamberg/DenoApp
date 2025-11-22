// deno-lint-ignore-file no-empty
import env from "../env.ts";
import { migrateTestDb } from "./migrate-test-db.ts";

export const removeTestDb = async () => {
  try {
    const cleanUp = new Deno.Command("rm", {
      cwd: Deno.cwd(),
      args: ["test.db", "test.db-shm", "test.db-wal"],
    }).spawn();
    await cleanUp.status;
  } catch {}
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const startTestDB = async (): Promise<Deno.ChildProcess> => {
  const testDbProcess = new Deno.Command("turso", {
    args: ["dev", "-p", "8181", "--db-file", "test.db"],
  }).spawn();

  await waitForServer();

  await migrateTestDb();

  for (let attempt = 1; attempt <= 20; attempt++) {
    try {
      const response = await fetch(env.DATABASE_URL, {
        method: "POST",
        body: JSON.stringify({ statements: ["select * from tasks limit 1"] }),
      });
      const json = await response.json().catch(() => null);
      response.body?.cancel().catch(() => {});
      if (json?.[0]?.results) {
        console.log("DB available!");
        return testDbProcess;
      }
    } catch {}
    await sleep(500);
  }

  throw new Error("Test DB not ready after migrations");
};
const waitForServer = async () => {
  for (let attempt = 1; attempt <= 40; attempt++) {
    try {
      const res = await fetch(env.DATABASE_URL, {
        method: "POST",
        body: JSON.stringify({ statements: ["select 1"] }),
      });
      res.body?.cancel().catch(() => {});
      if (res.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error("Test DB server did not start in time");
};



export const stopTestDB = async (testDbProcess: Deno.ChildProcess) => {
  try {
    testDbProcess.kill();
    await testDbProcess.status;
  } catch {}

  await removeTestDb();
};
