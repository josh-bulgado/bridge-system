import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <>
      <div>
        <Header />
        <Hero />
        <About />
        <Features />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
