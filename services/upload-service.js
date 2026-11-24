import axios from "axios";
import { fetchWithAuth } from "./base-service";


export async function uploadFileWithAuth(file, metaData = {}) {
  const formData = new FormData();
  formData.append("file", file);

  Object.entries(metaData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  try {
    const response = await axios.post(`/api/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (e) {
    throw new Error(e?.response?.data?.message || "Upload failed");
  }
}

export async function generateImageFromAI(prompt) {
  try {
    const response = await fetchWithAuth("/api/ai-image-gen", {
      method: "POST",
      body: {
        prompt,
      },
    });

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
}
