import { BarGraph, BarGraphM, BarStackGraph } from "../../components/graphs"
import { BarGraphL } from "../../components/graphs/BarGraphL"
import PieGraph from "../../components/graphs/PieGraph"
import WordCloudGraph from "../../components/graphs/WordCloudGraph"
import Default from "../../layout/Default"
import Hero from "./containers/Hero"

import './styles.scss'

const Home = () => {

  return (
    <Default>
      <div className="home__graphs-container">
        <Hero/>
        <BarGraph chartTitle="Chart Inner Title" scaleCoefficient={4} height={200} width={1000}/>
        <BarGraph chartTitle="Chart Inner Title" scaleCoefficient={1} height={500} width={1000}/>
        <BarGraphM height={500} width={1000}/>
        <BarGraphL height={500} width={1000}/>
        <section className="home__graphs-bottom-section">
          <WordCloudGraph height={400} width={500}/>
          <PieGraph height={500} width={500}/>
        </section>
      </div>
    </Default>
  )
}

export default Home