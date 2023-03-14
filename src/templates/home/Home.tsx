import { BarGraph, BarGraphM, BarStackGraph } from "../../components/graphs"
import { BarGraphL } from "../../components/graphs/BarGraphL"
import { HBarGraph } from "../../components/graphs/HBarGraph"
import WordCloudGraph from "../../components/graphs/WordCloudGraph"
import Default from "../../layout/Default"

import './styles.scss'

const Home = () => {

  return (
    <Default>
      <div className="home__graphs-container">
        <BarGraph scaleCoefficient={4} height={200} width={1000}/>
        <BarGraph scaleCoefficient={1} height={500} width={1000}/>
        <WordCloudGraph height={400} width={1000}/>
        <BarGraphM height={500} width={1000}/>
        <BarGraphL height={500} width={1000}/>
        <HBarGraph height={1000} width={500}/>
      </div>
    </Default>
  )
}

export default Home