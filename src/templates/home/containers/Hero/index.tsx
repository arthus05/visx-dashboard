import './styles.scss'

const Hero = () => {
  return (
    <header className='hero'>
      <h1>Income Report For Interview</h1>

      <section className='hero__transaction-data'>
        <h2>Transaction Data</h2>
        <p>
          Transaction data provide a unique lens into how customers earn their money. By
          understanding the inflows in a user's account, we can better understand their income
          and ultimately better serve them.
          At Chico, we categorize a user's inflow behavior to better model the nature of their work.
          We currently support these profiles:
        </p>
      </section>
    </header>
  )
}

export default Hero