// 用于映射mysql中的outbound表
export interface Outbound {
  outboundID: string;
  outboundOrderID: string;
  outboundGoodsID: string;
  outboundAmount: number;
  outboundCreatedByID: string;
  outboundCreatedTime: string;
}
