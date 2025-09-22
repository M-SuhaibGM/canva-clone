import { fetchWithAuth } from "./base-service";

export async function getUserSubscription() {
  return fetchWithAuth(`/api/subscription`);
}

export async function createPaypalOrder() {
  return fetchWithAuth(`/api/subscription`, {
    method: "post",
  });
}

export async function capturePaypalOrder(orderId) {
  return fetchWithAuth(`/v1/subscription/capture-order`, {
    method: "post",
    body: {
      orderId,
    },
  });
}
