/**
 * このファイルの目的
 * - Reservations API の最小限の統合テスト（作成/一覧/顧客別取得/更新/認証）を行います。
 * - それぞれのテストが何を検証しているか、手順を日本語で明確に記載しています。
 *
 * テストケース一覧
 * 1) POST /reservations → 201（予約を作成できる）
 *    - 手順: (a) 顧客を先に作成 (b) 正しい予約ボディで作成 (c) 201 とID返却を確認
 * 2) GET /reservations → 200（配列を返す）
 *    - 手順: (a) 一覧取得 (b) 200 と配列型を確認
 * 3) GET /reservations/customer/{customerId} → 200（顧客別の予約一覧）
 *    - 手順: (a) 顧客+予約作成 (b) 顧客IDで取得 (c) 200 と配列型を確認
 * 4) PUT /reservations/{id} → 200（予約の更新）
 *    - 手順: (a) 顧客+予約作成 (b) ステータス等を更新 (c) 200 と更新内容を確認
 * 5) 認証なし → 401
 *    - 手順: (a) Authorization ヘッダなしでアクセス (b) 401 を確認
 * 6) ［意図的失敗］存在しない予約ID更新で 200 を期待（実際は 404 になり失敗）
 *    - it.fails によって失敗を期待し、テストは成功扱い。
 */
import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authHeaders = {
  Authorization: `Bearer cf-dify-tool-test-key`,
  "Content-Type": "application/json",
};

async function createReservation(payload: {
  customer_id: number;
  customer_name: string;
  service_name: string;
  reservation_date: string;
  status: string;
  notes?: string | null;
}) {
  const res = await SELF.fetch(`http://local.test/reservations`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(payload),
  });
  const body = await res.json<{ success: boolean; result: { id: number } }>();
  return { status: res.status, body };
}

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
  const body = await res.json<{ success: boolean; result: { id: number; name: string } }>();
  return { status: res.status, body };
}

describe("Reservations API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /reservations → 201", async () => {
    const c = await createCustomer({
      name: "Res Taro",
      email: `res-taro+${Date.now()}@example.com`,
      phone: null,
    });
    const customerId = c.body.result.id;

    const { status, body } = await createReservation({
      customer_id: customerId,
      customer_name: "Res Taro",
      service_name: "Hair Cut",
      reservation_date: new Date().toISOString(),
      status: "pending",
      notes: null,
    });

    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.result.id).toEqual(expect.any(Number));
  });

  it("GET /reservations → 200", async () => {
    const res = await SELF.fetch(`http://local.test/reservations`, {
      headers: authHeaders,
    });
    const body = await res.json<{ success: boolean; result: any[] }>();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.result)).toBe(true);
  });

  it("GET /reservations/customer/{customerId} → 200", async () => {
    const c = await createCustomer({
      name: "Res Jiro",
      email: `res-jiro+${Date.now()}@example.com`,
      phone: "090-0000-0000",
    });
    const customerId = c.body.result.id;

    await createReservation({
      customer_id: customerId,
      customer_name: "Res Jiro",
      service_name: "Spa",
      reservation_date: new Date().toISOString(),
      status: "pending",
      notes: null,
    });

    const res = await SELF.fetch(
      `http://local.test/reservations/customer/${customerId}`,
      { headers: authHeaders },
    );
    const body = await res.json<{ success: boolean; data: any[] }>();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("PUT /reservations/{id} → 200", async () => {
    const c = await createCustomer({
      name: "Res Saburo",
      email: `res-saburo+${Date.now()}@example.com`,
      phone: null,
    });
    const customerId = c.body.result.id;

    const r = await createReservation({
      customer_id: customerId,
      customer_name: "Res Saburo",
      service_name: "Nail",
      reservation_date: new Date().toISOString(),
      status: "pending",
      notes: null,
    });
    const id = r.body.result.id;

    const res = await SELF.fetch(`http://local.test/reservations/${id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        customer_id: customerId,
        customer_name: "Res Saburo",
        service_name: "Nail",
        reservation_date: new Date().toISOString(),
        status: "confirmed",
        notes: "OK",
      }),
    });
    const body = await res.json<{ success: boolean; result: any }>();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.result.status).toBe("confirmed");
  });

  it("認証なし → 401", async () => {
    const res = await SELF.fetch(`http://local.test/reservations`);
    expect(res.status).toBe(401);
  });

  it.fails("［意図的失敗］存在しない予約IDに200が返るはず", async () => {
    // 実際は 404 を期待すべきだが、200を期待して失敗させる
    const res = await SELF.fetch(`http://local.test/reservations/999999`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        customer_id: 1,
        customer_name: "X",
        service_name: "Y",
        reservation_date: new Date().toISOString(),
        status: "confirmed",
        notes: null,
      }),
    });
    expect(res.status).toBe(200);
  });
});
