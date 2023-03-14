import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { MOCK_WORDS } from '../../../mock/wordCloud';
import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';

import './styles.scss'

interface ExampleProps {
  width: number;
  height: number;
}

export interface WordData {
  text: string;
  value: number;
}

const colors = ['#002F97', '#5079F2', '#81A0FF'];

const words = MOCK_WORDS;

const getValue = (w: WordData) => w.value 

const fontScale = scaleLog({
  domain: [Math.min(...words.map(getValue)), Math.max(...words.map(getValue))],
  range: [10, 100],
});
const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

export default function WordCloudGraph({ width, height }: ExampleProps) {
  return (
    <div className="wordcloud">
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        spiral={'rectangular'}
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </div>
  );
}