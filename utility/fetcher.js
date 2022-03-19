export default async function fetcher(...args) {
  const response = await fetch(...args);
  const result = await response.json();

  return result;
}