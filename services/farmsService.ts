export async function fetchFarms() {
  const baseUrl = "http://localhost:3000/farms";

  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(`Error: status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching farms:", error);
    throw error;
  }
}
