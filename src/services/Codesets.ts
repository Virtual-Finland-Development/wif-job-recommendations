const CODESETS_SERVICE_BASE_URL = process.env.CODESETS_SERVICE_BASE_URL;
const serviceStore = {
  Municipalities: null,
  BusinessFinlandEscoOccupations: null,
};

async function retrieveCodesetsResource(resourceName: keyof typeof serviceStore) {
  if (typeof CODESETS_SERVICE_BASE_URL === "undefined") {
    throw new Error("CODESETS_SERVICE_BASE_URL is not defined");
  }

  if (serviceStore[resourceName] === null) {
    const response = await fetch(`${CODESETS_SERVICE_BASE_URL}/resources/${resourceName}`);
    const resource = await response.json();
    serviceStore[resourceName] = resource;
  }
  return serviceStore[resourceName];
}

export async function getMunicipalities() {
  const municipalities = await retrieveCodesetsResource("Municipalities");
  if (municipalities === null) {
    throw new Error("Failed to fetch municipalities");
  }
  return municipalities as any[]; // Trust the municipalities data to be correct
}

export async function getOccupations() {
  const occupations = await retrieveCodesetsResource("BusinessFinlandEscoOccupations");
  if (occupations === null) {
    throw new Error("Failed to fetch occupations");
  }
  return occupations as any[]; // Trust the occupations data to be correct
}
