import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { useMemo } from "react";
import { getUserCount, ISources } from "..";
import { getIncome } from "..";

interface IMargin {
  bottom: number;
  right: number;
  left: number;
  top: number;
}

interface IProps {
  margin: IMargin;
  height: number;
  data: ISources;
  width: number;
}

export const colorKeys: { [key: string]: string } = {
  'BVS_INCOME': 'rgba(23, 30, 233, 0.9)',
  'CREDIT_CARD_LIMIT': 'rgba(23, 233, 44, 0.9)',
  'CHICO': 'rgba(233, 23, 23, 0.9)'
}

export const useScales = ({ data, width, height, margin }: IProps) => {
  const keys = useMemo<string[]>(() => Object.keys(data), [data])

  const { yMax, xMax } = useMemo(() => ({
    xMax: width - margin.right - margin.left,
    yMax: height - margin.top - margin.bottom
  }), [width, height, margin])

  const xScale = useMemo(() => scaleBand<number>({
    domain: data.CHICO.map(getIncome),
    range: [0, xMax],
    round: true,
    padding: 0.1,
  }), [xMax])

  const yScale = useMemo(() => scaleLinear<number>({
    domain: [0, Math.max(
      ...data.CHICO.map(getUserCount),
      ...data.CREDIT_CARD_LIMIT.map(getUserCount),
      ...data.BVS_INCOME.map(getUserCount)
      )
    ],
    range: [yMax, 0],
    round: true,
  }), [yMax])

  const yScaleChico = useMemo(() => scaleLinear<number>({
    domain: [0, Math.max(...data.CHICO.map(getUserCount))],
    range: [yMax, 0],
    round: true,
  }), [yMax])

  const yScaleCreditCard = useMemo(() => scaleLinear<number>({
    domain: [0, Math.max(...data.CREDIT_CARD_LIMIT.map(getUserCount))],
    range: [yMax, 0],
    round: true,
  }), [yMax])

  const yScaleBVS = useMemo(() => scaleLinear<number>({
    domain: [0, Math.max(...data.BVS_INCOME.map(getUserCount))],
    range: [yMax, 0],
    round: true,
  }), [yMax])

  const colorScale = useMemo(() => scaleOrdinal<string, string>({
    domain: keys,
    range: keys.map((key: string) => colorKeys[key]),
  }), [data]);

  return {
    yMax,
    xMax,
    xScale,
    yScale,
    yScaleBVS,
    yScaleChico,
    yScaleCreditCard,
    colorScale
  }
}