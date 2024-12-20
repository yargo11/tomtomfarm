export async function fetchCropTypes() {
  const CROP_URL = "http://localhost:3000/crop-types";

  try {
    const response = await fetch(CROP_URL);
    if (!response.ok) {
      throw new Error(`Error: status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching crops:", error);
    throw error;
  }
}
