const fetchUrlFromText = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Error fetching ${url}: ${response.statusText}`);
    return "";
  }
  const text = await response.text();
  return text;
};

export default fetchUrlFromText;
