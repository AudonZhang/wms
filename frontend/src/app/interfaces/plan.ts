// For the corresponding MySQL "plan" table
export interface Plan {
  planID: string;
  inOrOutbound: string;
  planGoodsID: string;
  planExpectedTime: string;
  planExpectedAmount: number;
  planStatus: string;
  planUpdatedByID: string;
  planUpdatedTime: string;
  planFinishedByID: string;
  planFinishedTime: string;
}
