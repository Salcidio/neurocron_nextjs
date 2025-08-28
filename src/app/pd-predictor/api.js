export async function submitPatientData(data, isFile) {
  const url =
    "https://huggingface.co/spaces/Amaro2a/flake_transfomers/blob/main/app" +
    (isFile ? "/predict/files" : "/predict");
  const headers = isFile ? {} : { "Content-Type": "application/json" };
  const body = isFile ? data : JSON.stringify(data);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch prediction");
  }

  return response.json();
}