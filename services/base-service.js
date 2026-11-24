import axios from "axios";
import { signOut } from "next-auth/react";

let signingOut = false;

/**
 * Thin axios wrapper for our own API routes. Auth is handled by the NextAuth
 * session cookie, so no Authorization header is needed. Errors keep the
 * server's message so the UI can show something useful.
 */
export async function fetchWithAuth(endpoint, options = {}) {
  try {
    const response = await axios({
      url: endpoint,
      method: options.method || "GET",
      headers: options.headers,
      data: options.body,
      params: options.params,
    });

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401 && typeof window !== "undefined" && !signingOut) {
      // Session expired/invalid: clear it and send the user to the login page.
      // (Signing out, rather than just redirecting, avoids a redirect loop
      // with the middleware.)
      signingOut = true;
      signOut({ callbackUrl: "/" });
    }
    const message =
      error?.response?.data?.message || error?.message || "Api request failed";
    const err = new Error(message);
    err.status = error?.response?.status;
    throw err;
  }
}
