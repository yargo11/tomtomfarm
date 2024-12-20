const CROP_URL = "http://localhost:3000/crop-types";

export async function fetchCropTypes() {
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

export async function addCropsToAPI(id: string, crop: string) {
  const newCrop = {
    id: id.toString(),
    name: crop,
  };

  try {
    const response = await fetch(CROP_URL, {
      method: "POST",
      headers: {
        "Content-type": "applciation/json",
      },
      body: JSON.stringify(newCrop),
    });

    if (!response.ok) {
      throw new Error(`Error: status ${response.status}`);
    }

    return await fetchCropTypes();
  } catch (error) {
    console.error("Error creating crop:", error);
    throw error;
  }
}

export async function deleteCropFromAPI(id: string) {
  try {
    const response = await fetch(`${CROP_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: status ${response.status}`);
    }

    return fetchCropTypes();
  } catch (error) {
    console.error("Error deleting crop:", error);
    throw error;
  }
}
