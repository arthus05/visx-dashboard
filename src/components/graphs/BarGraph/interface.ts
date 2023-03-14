export interface IData {
  income: number;
  userCount: number
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
  data?: any[];
  scaleCoefficient?: number;
  chartTitle?: string;
}