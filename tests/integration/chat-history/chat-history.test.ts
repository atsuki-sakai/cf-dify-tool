/**
 * このファイルの目的
 * - Chat History API の最小限の統合テスト（作成/一覧/顧客別取得/認証）を行います。
 * - それぞれのテストが何を検証しているか、手順を日本語で明確に記載しています。
 *
 * テストケース一覧
 * 1) POST /chat → 201（チャット履歴の作成）
 *    - 手順: (a) 顧客作成 (b) 正しいチャットボディで作成 (c) 201 とID返却を確認
 * 2) GET /chat → 200（配列を返す）
 *    - 手順: (a) 一覧取得 (b) 200 と配列型を確認
 * 3) GET /chat/customer/{customerId} → 200（顧客別のチャット履歴）
 *    - 手順: (a) 顧客+チャット作成 (b) 顧客IDで取得 (c) 200 と配列型を確認
 * 4) 認証なし → 401
 *    - 手順: (a) Authorization ヘッダなしでアクセス (b) 401 を確認
 */
import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
  const body = await res.json<{ success: boolean; result: { id: string } }>();
  return { status: res.status, body };
}

async function createChat(payload: {
  customer_id: string;
  user_name: string;
  message: string;
  response: string;
}) {
  const res = await SELF.fetch(`http://local.test/chat`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(payload),
  });
  const body = await res.json<{ success: boolean; result: { id: number } }>();
  return { status: res.status, body };
}

describe("Chat History API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /chat → 201", async () => {
    const c = await createCustomer({
      name: "Chat Taro",
      email: `chat-taro+${Date.now()}@example.com`,
      phone: null,
    });
    const customerId = c.body.result.id;

    const { status, body } = await createChat({
      customer_id: customerId,
      user_name: "user",
      message: "hello",
      response: "hi",
    });

    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.result.id).toEqual(expect.any(Number));
  });

  it("GET /chat → 200", async () => {
    const res = await SELF.fetch(`http://local.test/chat`, { headers: authHeaders });
    const body = await res.json<{ success: boolean; result: any[] }>();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.result)).toBe(true);
  });

  it("GET /chat/customer/{customerId} → 200", async () => {
    const c = await createCustomer({
      name: "Chat Jiro",
      email: `chat-jiro+${Date.now()}@example.com`,
      phone: "090-0000-0000",
    });
    const customerId = c.body.result.id;

    await createChat({
      customer_id: customerId,
      user_name: "user",
      message: "m1",
      response: "r1",
    });

    const res = await SELF.fetch(`http://local.test/chat/customer/${customerId}`, {
      headers: authHeaders,
    });
    const body = await res.json<{ success: boolean; data: any[] }>();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("認証なし → 401", async () => {
    const res = await SELF.fetch(`http://local.test/chat`);
    expect(res.status).toBe(401);
  });
});
