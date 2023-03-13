import { Group } from '@visx/group'
import { Bar, LinePath } from '@visx/shape'

import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis'
import { Text } from '@visx/text'
import { useEffect, useState } from 'react'
import { CHICO, CREDIT_CARD_LIMIT, BVS_INCOME, PERCENTAGE } from '../../../mock/barLine'

import './styles.scss'
import { Grid } from '@visx/grid'
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend'
import { colorKeys, useScales } from './hooks/useScales'


const defaultData = { CHICO, CREDIT_CARD_LIMIT, BVS_INCOME, PERCENTAGE }
const defaultMargin = { top: 40, right: 80, bottom: 60, left: 80 }

// accessors
export const getIncome = (d: IData) => d.income;
export const getRiskGroup = (d: IData) => d.riskGroup;
export const getPercentage = (d: IPercentageData) => d.value;
export const getPercentageRiskGroup = (d: IPercentageData) => d.riskGroup;

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

const legendTextTranslator: {[key: string]: string} = {
  CHICO: 'Chico Verified Income',
  CREDIT_CARD_LIMIT: 'Credit Card Limit',
  BVS_INCOME: 'BVS Income',
  PERCENTAGE: 'Default Rate'
}

export const BarGraphL = ({ width, height, events = false, margin = defaultMargin, data = defaultData, scaleCoefficient = 1}: IBarsProps) => {
  const [legendFilter, setLegendFilter] = useState<{[key: string]: boolean}>({
    CHICO: true,
    CREDIT_CARD_LIMIT: true,
    BVS_INCOME: true,
    PERCENTAGE: true
  })

  useEffect(() => {
    console.log('asdasd', legendFilter)
  }, [legendFilter])

  const {
    xMax,
    yMax,
    xScale,
    yScale,
    yScaleChico,
    yPercentageScale,
    // yScaleBVS,
    // yScaleCreditCard,
    colorScale
  } = useScales({ data, width, height, margin })

  const onLegendClick = (label: string) => {
    if (label === 'CHICO') {
      setLegendFilter({ ...legendFilter, CHICO: !legendFilter.CHICO })
    } else if (label === 'BVS_INCOME') {
      setLegendFilter({ ...legendFilter, BVS_INCOME: !legendFilter.BVS_INCOME })
    } else if (label === 'CREDIT_CARD_LIMIT') {
      setLegendFilter({ ...legendFilter, CREDIT_CARD_LIMIT: !legendFilter.CREDIT_CARD_LIMIT })
    } else if (label === 'PERCENTAGE') {
      setLegendFilter({ ...legendFilter, PERCENTAGE: !legendFilter.PERCENTAGE })
    }
  }

  return (
    <div className='bar-graph-l'>
      {
        width < 10 ? null : (
          <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill="var(--green-default)" fillOpacity={0.2} className='bar-graph__rect' rx={14} />
            <Grid
              top={margin.top}
              left={margin.left}
              xScale={xScale}
              yScale={yScale}
              width={xMax}
              height={yMax}
              stroke={'var(--foreground-color)'}
              strokeOpacity={0.1}
            />
            <Group top={margin.top} left={margin.left}>
              {legendFilter.PERCENTAGE && data.PERCENTAGE.map((d) => {
                const riskGroup = getPercentageRiskGroup(d);
                const barWidth = xScale.bandwidth();
                const barHeight = yMax - (yPercentageScale(getPercentage(d)) ?? 0);
                const barX = xScale(riskGroup);
                const barY = yMax - barHeight;
                return (
                  <>
                    <Bar
                      key={`bar-${riskGroup}`}
                      className='bar-graph-l__bar'
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={colorKeys.PERCENTAGE}
                      onClick={() => {
                        if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                      }}
                    />
                    <Text
                      x={barX! + barWidth / 2}
                      y={yMax - barHeight / 2}
                      fill="black"
                      dx={"-2ch"}
                      dy={"-.33rem"}
                      fontWeight="bold"
                    >
                      {`${getPercentage(d)}%`}
                    </Text>
                  </>
                );
              })}
              {
                legendFilter.CHICO && (
                  <LinePath
                    data={data.CHICO}
                    width={xMax}
                    x={(d) => {
                      const xScaleValue = xScale(getRiskGroup(d)) ?? 0
                      return xScaleValue + xScale.bandwidth() * 0.5
                    }}
                    y={(d) => yScale(getIncome(d)) ?? 0}
                    stroke={colorKeys.CHICO}
                    strokeWidth={2}
                    strokeOpacity={1}
                  />
                )
              }
              {
                legendFilter.CREDIT_CARD_LIMIT && (
                  <LinePath
                    data={data.CREDIT_CARD_LIMIT}
                    x={(d) => {
                      const xScaleValue = xScale(getRiskGroup(d)) ?? 0
                      return xScaleValue + xScale.bandwidth() * 0.5
                    }}
                    y={(d) => yScale(getIncome(d)) ?? 0}
                    stroke={colorKeys.CREDIT_CARD_LIMIT}
                    strokeWidth={2}
                    strokeOpacity={1}
                  />
                )
              }
              {
                legendFilter.BVS_INCOME && (
                  <LinePath
                    data={data.BVS_INCOME}
                    x={(d) => {
                      const xScaleValue = xScale(getRiskGroup(d)) ?? 0
                      return xScaleValue + xScale.bandwidth() * 0.5
                    }}
                    y={(d) => yScale(getIncome(d)) ?? 0}
                    stroke={colorKeys.BVS_INCOME}
                    strokeWidth={2}
                    strokeOpacity={1}
                  />
                )
              }
            </Group>
            <AxisLeft
              scale={yScale}
              numTicks={yScale.domain()[1] / (1000 * scaleCoefficient)}
              top={margin.top}
              left={margin.left}
              label={'User Count'}
              stroke='var(--foreground-color)'
              labelProps={{
                fontSize: '1rem',
                y: - margin.left / 2 - 20,
                x: - yMax * 0.5 - 24,
              }}
              tickLabelProps={{
                width: margin.left,
                fontSize: '1rem',
                fill: 'var(--foreground-color)',
              }}
            />
            <AxisRight
              scale={yPercentageScale}
              numTicks={yPercentageScale.domain()[1] / (10 * scaleCoefficient)}
              top={margin.top}
              left={width - margin.right}
              label={'Percentage'}
              stroke='var(--foreground-color)'
              labelProps={{
                fontSize: '1rem',
                y: - margin.left / 2 - 16,
                x: yMax * 0.5 - 32,
              }}
              tickFormat={(tick) => `${tick}%`}
              tickLabelProps={{
                width: margin.left,
                fontSize: '1rem',
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
              tickLabelProps={{
                fontSize: '1rem',
              }}
              numTicks={xScale.domain().length}/>
          </svg>
        )
      }
      <div
        className='bar-graph-m__legend'
        style={{ top: margin.top / 2 - 10 }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          style={{position: 'relative'}}
          labelMargin="0 15px 0 0">
            {labels => (
              <div className='bar-graph-m__legend-container'>
                {labels.map((label, i) =>(
                  <LegendItem
                    key={`legend-quantile-${i}`}
                    className={`${legendFilter[label.text] ? '' : 'ticked'}`}
                    margin="0 5px"
                    onClick={() => onLegendClick(label.text)}>
                    <svg width={20} height={20}>
                      <rect fill={label.value} width={20} height={20} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {legendTextTranslator[label.text]}
                    </LegendLabel>
                  </LegendItem>
                ))}
              </div>
            )}
        </LegendOrdinal>
      </div>
    </div>
  )
}
