const response = await fetch("https://d2k4lcvye9kq4z.cloudfront.net/resources/Municipalities");
const municipalities = await response.json();

// Trust the municipalities data to be correct
export function getCityNameWithMonicipalityCode(municipalityCode: string): string {
  const municipality = municipalities.find((municipality: any) => municipality.Koodi === municipalityCode);
  if (municipality) {
    const description = municipality.Selitteet.find((description: any) => description.Kielikoodi === "fi");
    if (description) {
      return description.Teksti;
    }
  }
  return "";
}

export function getMunicipalityCodeWithCityName(cityName: string): string {
  const municipality = municipalities.find((municipality: any) =>
    municipality.Selitteet.find((description: any) => description.Kielikoodi === "fi" && description.Teksti === cityName)
  );
  if (municipality) {
    return municipality.Koodi;
  }
  return "";
}
