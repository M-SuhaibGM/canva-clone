import { fetchWithAuth } from "./base-service";

export async function getUserDesigns() {
  const designs = await fetchWithAuth("/api/design");
  return Array.isArray(designs) ? designs : [];
}

export async function createDesign(designData) {
  return fetchWithAuth("/api/design", {
    method: "POST",
    body: designData,
  });
}

export async function getUserDesignByID(designId) {
  return fetchWithAuth(`/api/design/${designId}`);
}

export async function saveDesign(designData, designId = null) {
  return fetchWithAuth(`/api/design`, {
    method: "PUT",
    body: {
      ...designData,
      designId,
    },
  });
}

export async function deleteDesign(designId) {
  return fetchWithAuth(`/api/design/${designId}`, {
    method: "DELETE",
  });
}

export async function saveCanvasState(
  canvas,
  designId = null,
  title = "Untitled Design"
) {
  if (!canvas) return false;

  try {
    const canvasData = canvas.toJSON(["id", "filters"]);

    const designData = {
      name: title,
      canvasData: JSON.stringify(canvasData),
      width: canvas.width,
      height: canvas.height,
    };

    return saveDesign(designData, designId);
  } catch (error) {
    console.error("Error saving canvas state:", error);
    throw error;
  }
}
