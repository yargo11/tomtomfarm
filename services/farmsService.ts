import type { FarmsProps } from "@/types";

const FARM_URL = "http://localhost:3000/farms";

export async function fetchFarmsFromAPI() {
  try {
    const response = await fetch(FARM_URL);
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

export async function addFarmToAPI(farm: FarmsProps) {
  try {
    const response = await fetch(FARM_URL, {
      method: "POST",
      headers: {
        "Content-type": "applciation/json",
      },
      body: JSON.stringify(farm),
    });

    if (!response.ok) {
      throw new Error(`Error: status ${response.status}`);
    }

    return await fetchFarmsFromAPI();
  } catch (error) {
    console.error("Error creating farm:", error);
    throw error;
  }
}

export async function deleteFarmFromAPI(id: string) {
  try {
    const response = await fetch(`${FARM_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: status ${response.status}`);
    }

    return await fetchFarmsFromAPI();
  } catch (error) {
    console.error("Error creating farm:", error);
    throw error;
  }
}

export async function updateFarmToAPI(farm: FarmsProps) {
  try {
    const response = await fetch(`${FARM_URL}/${farm.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "applciation/json",
      },
      body: JSON.stringify(farm),
    });

    if (!response.ok) {
      throw new Error(`Failed to update farm: ${response.status}`);
    }

    return await fetchFarmsFromAPI();
  } catch (error) {
    console.log("Error updating farm: ", error);
  }
}
