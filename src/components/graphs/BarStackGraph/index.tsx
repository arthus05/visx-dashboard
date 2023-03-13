import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom } from '@visx/axis';
import cityTemperature, { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { localPoint } from '@visx/event';

import './styles.scss'
import { useState } from 'react';
import { useScales } from './hooks/useScales';

type CityName = 'New York' | 'San Francisco' | 'Austin';

type TooltipData = {
  bar: SeriesPoint<CityTemperature>;
  key: CityName;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarStackProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

interface IBarStackData {
  CHICO: { income: number, userCount: number }[],
  CREDIT_CARD_LIMIT: { income: number, userCount: number }[],
  BVS_INCOME: { income: number, userCount: number }[]
}

const purple1 = '#6c5efb';
const purple2 = '#c998ff';
export const purple3 = '#a44afe';
export const background = '#eaedff';
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

const data = cityTemperature.slice(0, 12)
const keys1 = Object.keys(data[0]).filter((d) => (d !== 'date')) as CityName[]
const keys = keys1.slice(0, 3)

const parseDate = timeParse('%Y-%m-%d')
const format = timeFormat('%b %d')
const formatDate = (date: string) => format(parseDate(date) as Date)

// accessors
export const getDate = (d: CityTemperature) => d.date
export const getSource = (d: IBarStackData) => Object.keys(d)
export const getIncome = (d: IBarStackData) => d.CHICO.map(i => i.income)

let tooltipTimeout: number;

export const BarStackGraph = ({
  width,
  height,
  events = false,
  margin = defaultMargin,
}: BarStackProps) => {
  console.log('data', data)
  const [legends, setLegends] = useState(keys.map(key => ({ label: key, enable: true })))

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<TooltipData>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({ scroll: true });

  const { colorScale, dateScale, temperatureScale } = useScales({ data })

  const onLegendClick = (label: CityName) => {
    const updatedLegends = legends.map(legend => {
      if (legend.label === label) {
        return {
          ...legend,
          enable: !legend.enable
        }
      }

      return legend
    })
    setLegends(updatedLegends)
  }

  // bounds
  const xMax = width;
  const yMax = height - margin.top - 100;

  dateScale.rangeRound([0, xMax]);
  temperatureScale.range([yMax, 0]);

  return width < 10 ? null : (
    <div className='bar-stack'>
      <svg ref={containerRef} width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={dateScale}
          yScale={temperatureScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={dateScale.bandwidth() / 2}
        />
        <Group top={margin.top}>
          <BarStack<CityTemperature, CityName>
            data={data}
            keys={keys}
            x={getDate}
            xScale={dateScale}
            yScale={temperatureScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onClick={() => {
                      if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                    }}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                      }, 300);
                    }}
                    onMouseMove={(event) => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                      // TooltipInPortal expects coordinates to be relative to containerRef
                      // localPoint returns coordinates relative to the nearest SVG, which
                      // is what containerRef is set to in this example.
                      const eventSvgCoords = localPoint(event);
                      const left = bar.x + bar.width / 2;
                      showTooltip({
                        tooltipData: bar,
                        tooltipTop: eventSvgCoords?.y,
                        tooltipLeft: left,
                      });
                    }}
                  />
                )),
              )
            }
          </BarStack>
        </Group>
        <AxisBottom
          top={yMax + margin.top}
          scale={dateScale}
          tickFormat={formatDate}
          stroke={purple3}
          tickStroke={purple3}
          tickLabelProps={{
            fill: purple3,
            fontSize: 11,
            textAnchor: 'middle',
          }}
        />
      </svg>
      <div
        className='bar-stack__legend'
        style={{ top: margin.top / 2 - 10 }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          style={{position: 'relative'}}
          labelMargin="0 15px 0 0">
            {labels => (
              <div className='bar-stack__legend-container'>
                {labels.map((label, i) =>(
                  <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="0 5px"
                  onClick={() => console.log('clicasse visse?')}
              >
                  <svg width={20} height={20}>
                    <rect fill={label.value} width={20} height={20} />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
                ))}
              </div>
            )}
        </LegendOrdinal>
      </div>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]}℉</div>
          <div>
            <small>{formatDate(getDate(tooltipData.bar.data))}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}