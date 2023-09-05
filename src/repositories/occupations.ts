const response = await fetch("https://d2k4lcvye9kq4z.cloudfront.net/resources/BusinessFinlandEscoOccupations");
const { occupations } = await response.json();

// Trust the occupations data to be correct
export function getJobCategoriesByEscoCode(escoCode: string): string[] {
  const occupation = occupations.find((occupation: any) => occupation.escoCode === escoCode);
  if (occupation) {
    return [occupation.escoJobTitle, ...occupation.alternativeTitles];
  }
  return [];
}
