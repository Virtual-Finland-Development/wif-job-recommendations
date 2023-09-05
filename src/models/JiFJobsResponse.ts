import { array, boolean, enumType, number, object, optional, string } from "valibot";

export const JifLocation = object({
  city: string(),
  area: enumType([
    "Päijät-Häme",
    "South Ostrobothnia",
    "Kanta-Häme",
    "South Karelia",
    "Kymenlaakso",
    "Uusimaa",
    "Lapland",
    "North Karelia",
    "South Savo",
    "North Savo",
    "Kainuu",
    "Central Finland",
    "Ostrobothnia",
    "Satakunta",
    "Southwest Finland",
    "Central Ostrobothnia",
    "North Ostrobothnia",
    "Pirkanmaa",
    "Åland",
    "Unknown",
  ]),
  country: enumType(["Finland"]),
});

export const JifCategory = enumType(["ict", "engineering", "academic", "health", "sales", "service", "administration", "finance", "hr", "manufacturing", "management"]);
export const JifCategoryName = enumType([
  "ICT",
  "Engineering",
  "Academic",
  "Health",
  "Marketing & sales",
  "Service",
  "Administration",
  "Finance",
  "HR",
  "Manufacturing & construction",
  "Project management",
]);

export const JiFJob = object({
  id: string(),
  title: string(),
  description: string(),
  imageUrl: string(),
  externalUrl: string(),
  employer: object({
    id: string(),
    name: string(),
    imageUrl: string(),
    externalUrl: string(),
    careersUrl: string(),
    location: JifLocation,
    source: string(),
    aliasForId: optional(string()),
  }),
  location: JifLocation,
  source: object({
    apiId: string(),
    documentId: string(),
    firstSeen: string(),
    lastSeen: string(),
    contactEmail: string(),
  }),
  schedule: object({
    publish: string(),
    expire: string(),
  }),
  clustering: object({
    categories: array(
      object({
        id: JifCategory,
        name: JifCategoryName,
        confidence: number(),
      })
    ),
    tags: array(
      object({
        id: string(),
        confidence: number(),
      })
    ),
    position: object({
      x: number(),
      y: number(),
    }),
  }),
  status: object({
    reviewStatus: enumType(["unreviewed", "automatic", "human"]),
    hiddenBecause: object({
      lowSkilledWork: optional(boolean()),
      finnishRequired: optional(boolean()),
      notInFinland: optional(boolean()),
      jobPostingExpired: optional(boolean()),
      duplicateJobPosting: optional(boolean()),
      missingInformation: optional(boolean()),
      wrongCategory: optional(boolean()),
      inaccurateTranslation: optional(boolean()),
      userSubmitted: optional(boolean()),
      deleted: optional(boolean()),
    }),
    reportedBecause: object({
      finnishRequired: optional(number()),
      notInFinland: optional(number()),
      jobPostingExpired: optional(number()),
      duplicateJobPosting: optional(number()),
      missingInformation: optional(number()),
      wrongCategory: optional(number()),
      inaccurateTranslation: optional(number()),
    }),
    transformations: object({
      machineTranslated: optional(boolean()),
      machineHidden: optional(boolean()),
    }),
    publicationStatus: optional(enumType(["pending", "published", "expired", "hidden"])),
  }),
});

export const JiFJobsResponse = array(JiFJob);
