import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { useMemo } from "react";
import { getDate, getIncome } from "..";
import { CityName } from "../interface";

interface IProps {
  data: any
}

export const useScales = ({ data }: IProps) => {

  const keys1 = Object.keys(data[0]).filter((d) => (d !== 'date')) as CityName[];
  const keys = keys1.slice(0, 3)
  const colorKeys = {
    'New York': '#6c5efb',
    'San Francisco': '#c998ff',
    'Austin': '#a44afe'
  }

  const temperatureTotals = data.reduce((allTotals: any, currentDate: any) => {
    const totalTemperature = keys.reduce((dailyTotal, k) => {
      dailyTotal += Number(currentDate[k]);
      return dailyTotal;
    }, 0);
    allTotals.push(totalTemperature);
    return allTotals;
  }, [] as number[]);

  const dateScale = useMemo(() => scaleBand<string>({
    domain: data.map(getDate),
    padding: 0.2,
  }), [data]);
  const temperatureScale = useMemo(() => scaleLinear<number>({
    domain: [0, Math.max(...temperatureTotals)],
    nice: true,
  }), [data]);
  const colorScale = useMemo(() => scaleOrdinal<CityName, string>({
    domain: keys,
    range: keys.map(key => colorKeys[key]),
  }), [data]);

  return {
    dateScale,
    temperatureScale,
    colorScale
  }
}