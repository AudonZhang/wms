// 用于映射mysql中的inbou表
export interface Inbound {
  inboundID: string;
  inboundOrderID: string;
  inboundGoodsID: string;
  inboundAmount: number;
  inboundUpdatedByID: string;
  inboundUpdatedTime: string;
}
