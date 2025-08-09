/**
 * このファイルの目的
 * - Customers API の最小限の統合テストを実行します（Cloudflare Workers / D1 / 認証込み）。
 * - それぞれのテストが何を検証しているか、手順を日本語で明確に記載しています。
 *
 * テストケース一覧
 * 1) POST /customers → 201 を返し、新規顧客を作成できる
 *    - 手順: (a) 正しいリクエストボディを送信 (b) 201 と作成IDの返却を確認
 * 2) GET /customers → 200 を返し、配列を返す
 *    - 手順: (a) 一覧取得 (b) 200 と配列型であることを確認
 * 3) GET /customers/{id} → 200 を返し、指定IDの顧客を取得できる
 *    - 手順: (a) 先に作成 (b) id を使って取得 (c) 200 と id 一致を確認
 * 4) PUT /customers/{id} → 200 を返し、顧客情報を更新できる
 *    - 手順: (a) 先に作成 (b) 更新リクエスト (c) 200 と更新反映を確認
 * 5) DELETE /customers/{id} → 200 を返し、顧客を削除できる
 *    - 手順: (a) 先に作成 (b) 削除リクエスト (c) 200 と削除対象IDの返却を確認
 * 6) 認証なし → 401 を返す
 *    - 手順: (a) Authorization ヘッダなしでアクセス (b) 401 を確認
 * 7) ［意図的失敗］認証なしでも200が返るはず
 *    - 失敗を期待するテスト（it.fails）。実際は 401 が返るため失敗し、テストは成功扱い。
 */
import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

// 最小限の顧客エンドポイント統合テスト
// - Bearer 認証必須のため、miniflare bindings に設定した APIKEY を使用

const authHeaders = {
  Authorization: `Bearer cf-dify-tool-test-key`,
  "Content-Type": "application/json",
};

async function createCustomer(payload: {
  name: string;
  email: string;
  phone?: string | null;
}) {
  const res = await SELF.fetch(`http://local.test/customers`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(payload),
  });
  const body = await res.json<{ success: boolean; result: { id: number } }>();
  return { status: res.status, body };
}

describe("Customers API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /customers → 201", async () => {
    const { status, body } = await createCustomer({
      name: "Taro",
      email: `taro+${Date.now()}@example.com`,
      phone: null,
    });
    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.result.id).toEqual(expect.any(Number));
  });

  it("GET /customers → 200 (empty or some)", async () => {
    const res = await SELF.fetch(`http://local.test/customers`, {
      headers: authHeaders,
    });
    const body = await res.json<{ success: boolean; result: any[] }>();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.result)).toBe(true);
  });

  it("GET /customers/{id} → 200", async () => {
    const { body: created } = await createCustomer({
      name: "Jiro",
      email: `jiro+${Date.now()}@example.com`,
      phone: "090-0000-0000",
    });
    const id = created.result.id;

    const res = await SELF.fetch(`http://local.test/customers/${id}`, {
      headers: authHeaders,
    });
    const body = await res.json<{ success: boolean; result: any }>();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.result.id).toBe(id);
  });

  it("PUT /customers/{id} → 200", async () => {
    const { body: created } = await createCustomer({
      name: "Saburo",
      email: `saburo+${Date.now()}@example.com`,
      phone: null,
    });
    const id = created.result.id;

    const res = await SELF.fetch(`http://local.test/customers/${id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Saburo Updated",
        email: `saburo-updated+${Date.now()}@example.com`,
        phone: null,
      }),
    });
    const body = await res.json<{ success: boolean; result: any }>();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.result.name).toBe("Saburo Updated");
  });

  it("DELETE /customers/{id} → 200", async () => {
    const { body: created } = await createCustomer({
      name: "Shiro",
      email: `shiro+${Date.now()}@example.com`,
      phone: null,
    });
    const id = created.result.id;

    const res = await SELF.fetch(`http://local.test/customers/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    const body = await res.json<{ success: boolean; result: any }>();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.result.id).toBe(id);
  });

  it("認証なし → 401", async () => {
    const res = await SELF.fetch(`http://local.test/customers`);
    expect(res.status).toBe(401);
  });

  it.fails("［意図的失敗］認証なしでも200が返るはず", async () => {
    // 手順: 1) 認証ヘッダなしでアクセス 2) 本来は401だが、あえて200を期待して失敗させる
    const res = await SELF.fetch(`http://local.test/customers`);
    // ここは実際は 401 が返るため、このアサーションは失敗する → it.fails によりテストは成功扱い
    expect(res.status).toBe(200);
  });
});
