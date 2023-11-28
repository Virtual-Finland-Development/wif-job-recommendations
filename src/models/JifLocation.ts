import { enumType, object, string } from "valibot";

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
