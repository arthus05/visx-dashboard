export interface IData {
  income: number;
  riskGroup: string;
}

export interface IPercentageData {
  value: number;
  riskGroup: string;
}

export interface ISources {
  CHICO: IData[];
  CREDIT_CARD_LIMIT: IData[];
  BVS_INCOME: IData[];
  PERCENTAGE: IPercentageData[]
}

export interface IMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IBarsProps {
  width: number;
  height: number;
  margin?: IMargin;
  events?: boolean;
  data?: ISources;
  scaleCoefficient?: number;
}

export type TooltipData = string;