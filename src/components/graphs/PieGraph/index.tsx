import { useState } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';

import { BANK_USAGE, PAYMENT_METHOD } from '../../../mock/pieGraph';
import { IBankUsage, IPaymentMethodFrequency } from './interface';

import { animated, useTransition, interpolate } from '@react-spring/web';

// data and types
type BankNames = keyof IBankUsage;

interface BankUsage {
  label: string;
  usage: number;
}

const methods: IPaymentMethodFrequency[] = PAYMENT_METHOD.slice(0, 4);
const bankNames = Object.keys(BANK_USAGE[0]) as BankNames[];
const bankUsage: BankUsage[] = BANK_USAGE
// accessor functions
const usage = (d: BankUsage) => d.usage;
const frequency = (d: IPaymentMethodFrequency) => d.frequency;

// color scales
const getBankColor = scaleOrdinal({
  domain: bankNames,
  range: [
    'rgba(80, 121, 242, 0.7)',
    'rgba(80, 121, 242, 0.6)',
    'rgba(80, 121, 242, 0.5)',
    'rgba(80, 121, 242, 0.4)',
    'rgba(80, 121, 242, 0.3)',
    'rgba(80, 121, 242, 0.2)',
    'rgba(80, 121, 242, 0.1)',
  ],
});
const getMethodFrequencyColor = scaleOrdinal({
  domain: methods.map((l) => l.method),
  range: ['rgba(4,217,217,1)', 'rgba(4,217,217,0.8)', 'rgba(4,217,217,0.6)', 'rgba(4,217,217,0.4)'],
});

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export type PieProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
};

export default function PieGraph({
  width,
  height,
  margin = defaultMargin,
  animate = true,
}: PieProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 70;

  return (
    <svg width={width} height={height}>
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={
            selectedBank ? bankUsage.filter(({ label }) => label === selectedBank) : bankUsage
          }
          pieValue={usage}
          outerRadius={radius}
          innerRadius={radius - donutThickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie<BankUsage>
              {...pie}
              animate={animate}
              getKey={(arc) => arc.data.label}
              onClickDatum={({ data: { label } }) =>
                animate &&
                setSelectedBank(selectedBank && selectedBank === label ? null : label)
              }
              getColor={(arc) => getBankColor(arc.data.label as keyof IBankUsage)}
            />
          )}
        </Pie>
        <Pie
          data={
            selectedPaymentMethod
              ? methods.filter(({ method }) => method === selectedPaymentMethod)
              : methods
          }
          pieValue={frequency}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness * 1.3}
        >
          {(pie) => (
            <AnimatedPie<IPaymentMethodFrequency>
              {...pie}
              animate={animate}
              getKey={({ data: { method } }) => method}
              onClickDatum={({ data: { method } }) =>
                animate &&
                setSelectedPaymentMethod(
                  selectedPaymentMethod && selectedPaymentMethod === method ? null : method,
                )
              }
              getColor={({ data: { method } }) => getMethodFrequencyColor(method)}
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="var(--foreground-color)"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={14}
              fontWeight="bold"
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}