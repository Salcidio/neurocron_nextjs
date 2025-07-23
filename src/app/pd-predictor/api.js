export async function submitPatientData(data, isFile) {
  const url = process.env.NEXT_PUBLIC_API_URL + '/predict'; // Render API endpoint
  const headers = isFile ? {} : { 'Content-Type': 'application/json' };
  const body = isFile ? data : JSON.stringify(data);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prediction');
  }

  return response.json();
}