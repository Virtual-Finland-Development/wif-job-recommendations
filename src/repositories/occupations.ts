const service = {
  data: null,
  async getOccupations() {
    if (this.data === null) {
      const response = await fetch("https://d2k4lcvye9kq4z.cloudfront.net/resources/BusinessFinlandEscoOccupations");
      const { occupations } = await response.json();
      this.data = occupations;
    }
    if (this.data === null) {
      throw new Error("Failed to fetch municipalities");
    }
    return this.data as any[]; // Trust the occupations data to be correct
  },
};

// Trust the occupations data to be correct
export async function getJobCategoriesByEscoCode(escoCode: string): Promise<string[]> {
  const occupations = await service.getOccupations();
  const occupation = occupations.find((occupation: any) => occupation.escoCode === escoCode);
  if (occupation) {
    return [occupation.escoJobTitle, ...occupation.alternativeTitles];
  }
  return [];
}
