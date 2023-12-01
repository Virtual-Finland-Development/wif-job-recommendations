import { getMunicipalities } from "../services/Codesets";

export async function getCityNameWithMonicipalityCode(municipalityCode: string): Promise<string> {
  const municipalities = await getMunicipalities();
  const municipality = municipalities.find((municipality: any) => municipality.Koodi === municipalityCode);
  if (municipality) {
    const description = municipality.Selitteet.find((description: any) => description.Kielikoodi === "fi");
    if (description) {
      return description.Teksti;
    }
  }
  return "";
}

export async function getMunicipalityCodeWithCityName(cityName: string): Promise<string | null> {
  const municipalities = await getMunicipalities();
  const municipality = municipalities.find((municipality: any) =>
    municipality.Selitteet.find((description: any) => description.Kielikoodi === "fi" && description.Teksti.toLocaleLowerCase() === cityName.toLocaleLowerCase())
  );
  if (municipality) {
    return municipality.Koodi;
  }
  return null;
}
