// 用于映射mysql中的goods表
export interface Goods {
  goodsID: string;
  goodsName: string;
  goodsSpecification: string;
  goodsManufacturer: string;
  goodsProductionLicense: string;
  goodsUnit: string;
  goodsStorageCondition: string;
  goodsCreatedByID: string;
  goodsCreatedTime: string;
}
