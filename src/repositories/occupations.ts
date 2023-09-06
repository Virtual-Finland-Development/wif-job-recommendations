import { getOccupations } from "../services/Codesets";

export async function getJobCategoriesByEscoCode(escoCode: string): Promise<string[]> {
  const occupations = await getOccupations();
  const occupation = occupations.find((occupation: any) => occupation.escoCode === escoCode);
  if (occupation) {
    return [occupation.escoJobTitle, ...occupation.alternativeTitles];
  }
  return [];
}
