import { array, boolean, enumType, number, object, optional, string } from "valibot";
import { JifLocation } from "./JifLocation";

export const JifJob = object({
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
        id: string(),
        name: string(),
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
