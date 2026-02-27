export async function submitPrediction(endpoint, body) {
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

  return response.json();
}

// Legacy file-upload path (CSV tab — kept for future use)
export async function submitPatientData(data, isFile, endpoint) {
  const url = endpoint || process.env.NEXT_PUBLIC_API_URL + "/predict";
  const headers = isFile
    ? { "ngrok-skip-browser-warning": "true" }
    : { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" };
  const body = isFile ? data : JSON.stringify(data);

  const response = await fetch(url, { method: "POST", headers, body });

  if (!response.ok) {
    throw new Error("Failed to fetch prediction");
  }

  return response.json();
}
