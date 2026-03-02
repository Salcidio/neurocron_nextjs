export async function submitPrediction(endpoint, body) {
  console.log(endpoint);

  try {
    console.log(endpoint);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error(
        "Failed to fetch: Connection refused or CORS error. Please check if your ngrok tunnel is active and CORS is enabled in your Colab/Model script.",
      );
    }
    throw error;
  }
}

// Legacy file-upload path (CSV tab — kept for future use)
export async function submitPatientData(data, isFile, endpoint) {
  const url = endpoint + "/predict";
  const headers = isFile
    ? { "ngrok-skip-browser-warning": "true" }
    : {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      };
  const body = isFile ? data : JSON.stringify(data);

  const response = await fetch(url, { method: "POST", headers, body });

  if (!response.ok) {
    throw new Error("Failed to fetch prediction");
  }

  return response.json();
}
