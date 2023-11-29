export enum DataProductName {
  ForeignerJobRecommendatations = "/Employment/ForeignerJobRecommendatations",
  ForeignerJobRecommendations = "/Employment/ForeignerJobRecommendations",
  Default = "/Employment/ForeignerJobRecommendations",
}

export type DataProduct = {
  version: number;
  versionText: string;
  dataProductName: DataProductName;
  fullDataProduct: string;
};
