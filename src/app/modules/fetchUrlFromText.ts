const fetchUrlFromText = async (url: string) => (await fetch(url)).text();

export default fetchUrlFromText;
