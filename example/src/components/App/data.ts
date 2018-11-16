export default async function loadData(): Promise<Data[]> {
  const data = await fetch("/map.csv", {
    credentials: "same-origin",
  }).then(r => r.text());
  const csv = data
    .split("\n")
    .map(d => d.split(",").map(dd => dd.trim()))
    .filter(d => d.length > 0);
  return csv.map((d, i) => ({
    id: i.toString(),
      image: `images/1.svg`,
      regionName_jp: d[0],
      regionName_en: d[1],
      regionName_h: d[2],
      year: d[3],
      person: d[4],
      bible: d[5],
      lat: parseFloat(d[6]),
      lon: parseFloat(d[7]),
  }));
}