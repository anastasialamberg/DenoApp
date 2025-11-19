import test from "node:test";
import env from "../env.ts";
import console from "node:console";

export const removeTestDb = async () => {
    try{
        const cleanUp = new Deno.Command("rm", {
            cwd: Deno.cwd(),
            args:  ["test.db", "test.db-shm", "test.db-wal"],
        }).spawn();
        await cleanUp.status;
        //deno-lint-ignore no-empty
    } catch {}
};

export const startTestDb = async (): Promise<Deno.ChildProcess> => {
    const testDbProcess  = new Deno.Command("turso", {
        args: ["dev","-p","8181", "--db-file", "test.db"],
}).spawn();
//wait for process to spin up before pushing schema
await new Promise((resolve) => setTimeout(resolve,  1000));

const pushDb = new Deno.Command("deno", {
    args: ["task", "db:push:test"],
}).spawn();
await pushDb.status;

return new Promise ((resolve) => {
    const healthCheck = async () =>{
        try {
            const response = await fetch(env.DATABASE_URL, {
                method: "POST",
                body: JSON.stringify({"statement": ["select * from tasks"]}),
            });
            const json = await response.json();
            if (json[0].results) {
                console.log("DB available");
                resolve(testDbProcess);
            } else {
                setTimeout(healthCheck, 1000);
            }
        } catch {
            console.log("Waiting for DB...");
            setTimeout(healthCheck, 1000);
        }
    
    };
})
};

export const stopTestDb = async (testDbProcess: Deno.ChildProcess) => {
  return new Promise((resolve) =>{
    const cleanup = async () => {
        console.log("Stopping test DB...");
        try {
            testDbProcess.kill();
            await testDbProcess.status;
            //deno-lint-ignore no-empty
        } catch {}
            await removeTestDb();
            resolve(true); 
    };
    setTimeout(cleanup, 500);
  })
};