import {
  addFarmToAPI,
  deleteFarmFromAPI,
  fetchFarmsFromAPI,
} from "@/services/farmsService";
import type { FarmsProps } from "@/types";

export async function addFarm(farm: FarmsProps) {
  try {
    await addFarmToAPI(farm);
    return await fetchFarmsFromAPI();
  } catch (error) {
    console.error("Error adding a farm: ", error);
  }
}

export async function deleteFarm(id: string) {
  try {
    await deleteFarmFromAPI(id);
    return await fetchFarmsFromAPI();
  } catch (error) {
    console.error("Error deleting a farm: ", error);
  }
}
