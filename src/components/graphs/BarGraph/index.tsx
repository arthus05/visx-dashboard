import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear, scaleBand } from '@visx/scale'

import { AxisBottom, AxisLeft } from '@visx/axis'
import { useMemo } from 'react'
import { CHICO } from '../../../mock/barGraph'

import { Text } from '@visx/text'

import './styles.scss'

const defaultData = CHICO
const defaultMargin = { top: 40, right: 30, bottom: 60, left: 80 }

// accessors
const getIncome = (d: { income: number, userCount: number }) => d.income;
const getUserCount = (d: { income: number, userCount: number }) => Number(d.userCount);

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

export const BarGraph = ({
  width,
  height,
  events = false,
  margin = defaultMargin,
  data = defaultData,
  scaleCoefficient = 1,
  chartTitle
}: IBarsProps) => {
  // bounds
  const xMax = width - margin.right - margin.left;
  const yMax = height - margin.top - margin.bottom;

  const xScale = useMemo(() => scaleBand<number>({
    domain: data.map(getIncome),
    range: [0, xMax],
    round: true,
    padding: 0.4
  }), [xMax])
  console.log('domain', xScale.domain());

  const yScale = useMemo(() => scaleLinear<number>({
    domain: [0, Math.max(...data.map(getUserCount))],
    range: [yMax, 0],
    round: true,
  }), [yMax])

  return (
    <div className='bar-graph'>
      {
        width < 10 ? null : (
          <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill="var(--green-default)" fillOpacity={0.2} className='bar-graph__rect' rx={14} />
            <Text x={"46%"} y={"10%"} fontWeight="bold">{chartTitle}</Text>
            <Group top={margin.top} left={margin.left}>
              {data.map((d) => {
                const income = getIncome(d);
                const barWidth = xScale.bandwidth();
                const barHeight = yMax - (yScale(getUserCount(d)) ?? 0);
                const barX = xScale(income);
                const barY = yMax - barHeight;
                return (
                  <Bar
                    key={`bar-${income}`}
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill="rgba(23, 100, 233, 0.5)"
                    onClick={() => {
                      if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                    }}
                  />
                );
              })}
            </Group>
            <AxisLeft
              scale={yScale}
              numTicks={yScale.domain()[1] / (5000 * scaleCoefficient)}
              top={margin.top}
              left={margin.left}
              label={'User Count'}
              stroke='var(--foreground-color)'
              labelProps={{
                fontSize: '1rem',
                y: - margin.left / 2 - 16,
                x: - yMax * 0.5 - 24,
              }}
              tickLabelProps={{
                width: margin.left,
                fill: 'var(--foreground-color)',
              }}
            />
            <AxisBottom
              top={yMax + margin.top}
              left={margin.left}
              scale={xScale}
              label={'Average Monthly Inflow'}
              labelProps={{
                fontSize: '1rem',
                y: margin.bottom - 10,
                x: '35%',
              }}
              numTicks={xScale.domain().length}/>
          </svg>
        )
      }
    </div>
  )
}
