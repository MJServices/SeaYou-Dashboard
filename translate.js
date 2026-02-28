const { Translate } = require("@google-cloud/translate").v2;
const fs = require("fs");
const path = require("path");

const apiKey = "AIzaSyBvqbLa3RI6sXY3ixgIarHotElUwWwYDIw";
const translateClient = new Translate({ key: apiKey });

async function translateObject(obj) {
  const translated = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      translated[key] = await translateObject(value);
    } else if (typeof value === "string") {
      const icuRegex = /\{[^{}]+\}/g;
      const placeholders = value.match(icuRegex) || [];
      let textToTranslate = value;
      placeholders.forEach((p, i) => {
        textToTranslate = textToTranslate.split(p).join(`__PH${i}__`);
      });

      try {
        let [translation] = await translateClient.translate(
          textToTranslate,
          "fr",
        );
        placeholders.forEach((p, i) => {
          translation = translation.split(`__PH${i}__`).join(p);
        });
        translated[key] = translation;
      } catch (err) {
        console.error(`Error translating "${value}":`, err.message);
        translated[key] = value; // Fallback to English
      }
    }
  }
  return translated;
}

async function run() {
  const enPath = path.join(__dirname, "messages", "en.json");
  if (!fs.existsSync(enPath)) {
    console.error("en.json not found");
    return;
  }
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  console.log("Translating...");
  const fr = await translateObject(en);

  const frPath = path.join(__dirname, "messages", "fr.json");
  fs.writeFileSync(frPath, JSON.stringify(fr, null, 2));
  console.log("French translation generated at", frPath);
}

run().catch(console.error);
