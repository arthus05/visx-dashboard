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
        <BarGraph chartTitle="Number of Users per Average Monthly Inflow" scaleCoefficient={4} height={200} width={1000}/>
        <BarGraph chartTitle="Number of Users per Average Monthly Inflow" scaleCoefficient={1} height={500} width={1000}/>
        <BarGraphM chartOuterTitle="Number of Users per Income - Chico, Credit Card Limit and Income comparison" height={500} width={1000}/>
        <BarGraphL height={500} width={1000}/>
        <section className="home__graphs-bottom-section">
          <h3>What for and how users use their income for</h3>
          <section className="home__graphs-bottom-section__graphs">
            <WordCloudGraph height={400} width={500}/>
            <PieGraph height={500} width={500}/>
          </section>
        </section>
      </div>
    </Default>
  )
}

export default Home