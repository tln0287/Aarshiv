import { MotionConfig } from 'framer-motion'
import { QuoteProvider } from './lib/quote.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/hero/Hero.jsx'
import About from './components/About.jsx'
import Products from './components/products/Products.jsx'
import Journey from './components/Journey.jsx'
import Quality from './components/Quality.jsx'
import Why from './components/Why.jsx'
import Markets from './components/Markets.jsx'
import Carousel from './components/Carousel.jsx'
import Requirement from './components/forms/Requirement.jsx'
import Quote from './components/forms/Quote.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import BackToTop from './components/BackToTop.jsx'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <QuoteProvider>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-brand">
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <Hero />
          <About />
          <Products />
          <Journey />
          <Quality />
          <Why />
          <Markets />
          <Carousel />
          <Requirement />
          <Quote />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </QuoteProvider>
    </MotionConfig>
  )
}
