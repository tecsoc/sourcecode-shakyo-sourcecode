const fetchUrlFromText = async (url: string) => await (await fetch(url)).text();

export default fetchUrlFromText;
