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

export async function addFarmToAPI(newFarm: FarmsProps) {
  try {
    const response = await fetch(FARM_URL, {
      method: "POST",
      headers: {
        "Content-type": "applciation/json",
      },
      body: JSON.stringify(newFarm),
    });

    if (!response.ok) {
      throw new Error(`Error: status ${response.status}`);
    }
  } catch (error) {
    console.error("Error creating farm:", error);
    throw error;
  }
}

export async function deleteFarmFromAPI(id:string){
  try {
    const response = await fetch(`${FARM_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Error: status ${response.status}`);
    }
  } catch (error) {
    console.error("Error creating farm:", error);
    throw error;
  }
}