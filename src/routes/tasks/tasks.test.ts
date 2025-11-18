/* eslint-disable no-console */
import { testClient } from "hono/testing";
import { describe, expect, expectTypeOf, it } from "vitest";

import CreateApp, { CreateTestApp } from "../../lib/create-app";
import router from "./tasks.index";

describe("tasks list", () => {
  it("responds with an array", async () => {
    const testRouter = CreateTestApp(router);
    const response = await testRouter.request("/tasks");
    const result = await response.json();
    console.log(result);
    // @ts-expect-error: TypeScript does not recognize the custom toBeArray method
    expectTypeOf(result).toBeArray();
  });

  it("responds with an array again", async () => {
    const client = testClient(CreateApp().route("/", router));
    const response = await client.tasks.$get();
    const json = await response.json();
    expectTypeOf(json).toBeArray();
  });

  it("validates the id param", async () => {
    const client = testClient(CreateApp().route("/", router));
    const response = await client.tasks[":id"].$get({
      param: {
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
  });

  it("validates the body when creating", async () => {
    const client = testClient(CreateApp().route("/", router));
    const response = await client.tasks.$post({
      // ts-expect-error
      json: {
        name: "Learn vitest",
        done: false,
      },
    });
    expect(response.status).toBe(422);
  });
});