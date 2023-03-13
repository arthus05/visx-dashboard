import { Group } from '@visx/group'
import { Bar } from '@visx/shape'

import { AxisBottom, AxisLeft } from '@visx/axis'
import { useEffect, useState } from 'react'
import { CHICO, CREDIT_CARD_LIMIT, BVS_INCOME } from '../../../mock/barGraph'

import './styles.scss'
import { Grid } from '@visx/grid'
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend'
import { useScales } from './hooks/useScales'


const defaultData = { CHICO, CREDIT_CARD_LIMIT, BVS_INCOME }
const defaultMargin = { top: 40, right: 30, bottom: 60, left: 80 }

// accessors
export const getIncome = (d: { income: number, userCount: number }) => d.income;
export const getUserCount = (d: { income: number, userCount: number }) => Number(d.userCount);

export interface IData {
  income: number;
  userCount: number
}

export interface ISources {
  CHICO: IData[];
  CREDIT_CARD_LIMIT: IData[];
  BVS_INCOME: IData[];
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
  CHICO: 'Chico',
  CREDIT_CARD_LIMIT: 'Credit Card Limit',
  BVS_INCOME: 'BVS Income'
}

export const BarGraphM = ({ width, height, events = false, margin = defaultMargin, data = defaultData, scaleCoefficient = 1}: IBarsProps) => {
  const [legendFilter, setLegendFilter] = useState<{[key: string]: boolean}>({
    CHICO: true,
    CREDIT_CARD_LIMIT: true,
    BVS_INCOME: true
  })

  useEffect(() => {
    console.log('asdasd', legendFilter)
  }, [legendFilter])

  const {
    xMax,
    yMax,
    xScale,
    yScale,
    yScaleBVS,
    yScaleChico,
    yScaleCreditCard,
    colorScale
  } = useScales({ data, width, height, margin })

  const onLegendClick = (label: string) => {
    if (label === 'CHICO') {
      setLegendFilter({ ...legendFilter, CHICO: !legendFilter.CHICO })
    } else if (label === 'BVS_INCOME') {
      setLegendFilter({ ...legendFilter, BVS_INCOME: !legendFilter.BVS_INCOME })
    } else if (label === 'CREDIT_CARD_LIMIT') {
      setLegendFilter({ ...legendFilter, CREDIT_CARD_LIMIT: !legendFilter.CREDIT_CARD_LIMIT })
    }
  }

  return (
    <div className='bar-graph-m'>
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
              {legendFilter.BVS_INCOME && data.BVS_INCOME.map((d) => {
                const income = getIncome(d);
                const barWidth = xScale.bandwidth();
                const barHeight = yMax - (yScaleBVS(getUserCount(d)) ?? 0);
                const barX = xScale(income);
                const barY = yMax - barHeight;
                return (
                  <>
                    <Bar
                      key={`bar-${income}-credit-card-limit`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill="rgba(23, 30, 233, 0.9)"
                      onClick={() => {
                        if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                      }}
                    />
                  </>
                );
              })}
              {legendFilter.CREDIT_CARD_LIMIT && data.CREDIT_CARD_LIMIT.map((d) => {
                const income = getIncome(d);
                const barWidth = xScale.bandwidth();
                const barHeight = yMax - (yScaleCreditCard(getUserCount(d)) ?? 0);
                const barX = xScale(income);
                const barY = yMax - barHeight;
                return (
                  <>
                    <Bar
                      key={`bar-${income}-credit-card-limit`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill="rgba(23, 233, 44, 0.9)"
                      onClick={() => {
                        if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                      }}
                    />
                  </>
                );
              })}
              {legendFilter.CHICO && data.CHICO.map((d) => {
                const income = getIncome(d);
                const barWidth = xScale.bandwidth();
                const barHeight = yMax - (yScaleChico(getUserCount(d)) ?? 0);
                const barX = xScale(income);
                const barY = yMax - barHeight;
                return (
                  <>
                    <Bar
                      key={`bar-${income}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill="rgba(233, 118, 23, 0.9)"
                      onClick={() => {
                        if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                      }}
                    />
                  </>
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
