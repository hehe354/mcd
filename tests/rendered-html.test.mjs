import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("contains the restaurant pickup board and durable schema", async () => {
  const [page, layout, schema] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /智能取餐看板/);
  assert.match(page, /重複取餐提醒/);
  assert.match(page, /清除本餐廳全部紀錄/);
  assert.match(layout, /title: "智能取餐看板"/);
  assert.match(schema, /pickup_records/);
  assert.match(schema, /restaurants/);
});
