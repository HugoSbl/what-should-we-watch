export async function fetchShows(searchInput) {
  const response = await fetch(`https://api.tvmaze.com/search/${searchInput}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data;
}
