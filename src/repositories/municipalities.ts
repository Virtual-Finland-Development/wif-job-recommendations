const service = {
  data: null,
  async getMunicipalities() {
    if (this.data === null) {
      const response = await fetch("https://d2k4lcvye9kq4z.cloudfront.net/resources/Municipalities");
      this.data = await response.json();
    }
    if (this.data === null) {
      throw new Error("Failed to fetch municipalities");
    }
    return this.data as any[]; // Trust the municipalities data to be correct
  },
};

export async function getCityNameWithMonicipalityCode(municipalityCode: string): Promise<string> {
  const municipalities = await service.getMunicipalities();
  const municipality = municipalities.find((municipality: any) => municipality.Koodi === municipalityCode);
  if (municipality) {
    const description = municipality.Selitteet.find((description: any) => description.Kielikoodi === "fi");
    if (description) {
      return description.Teksti;
    }
  }
  return "";
}

export async function getMunicipalityCodeWithCityName(cityName: string): Promise<string> {
  const municipalities = await service.getMunicipalities();
  const municipality = municipalities.find((municipality: any) =>
    municipality.Selitteet.find((description: any) => description.Kielikoodi === "fi" && description.Teksti === cityName)
  );
  if (municipality) {
    return municipality.Koodi;
  }
  return "";
}
