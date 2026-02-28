async function scrapeUrl(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    console.log(`\nURL: ${url}`);
    console.log(`Title: ${titleMatch ? titleMatch[1] : "none"}`);

    // Check for standard Shell headers
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    console.log(`H1: ${h1Match ? h1Match[1] : "none"}`);

    if (html.includes("Questions coquines")) {
      console.log("Contains localized string normally.");
    } else if (html.includes("Naughty Questions")) {
      console.log("Contains fallback string.");
    }
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await scrapeUrl("http://localhost:3000/fr/fantasies");
  await scrapeUrl("http://localhost:3000/fr/naughty-questions");
}
run();
