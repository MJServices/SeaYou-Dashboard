fetch("http://localhost:3000/", { redirect: "manual" }).then((r) => {
  console.log("Root Status:", r.status);
  console.log("Root Location:", r.headers.get("location"));
});

fetch("http://localhost:3000/fr")
  .then((r) => r.text())
  .then((t) => {
    console.log("Contains French Title:", t.includes("Tableau de bord"));
    console.log("Contains Error string:", t.includes("Dashboard.trendText"));
  });
