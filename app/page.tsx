import Homepage from "./components/Homepage/page";
import HeroSection from "./components/HeroSection/page";
import Footer from "./components/Footer/page";
import ReviewForm from "./components/ReviewForm/page";

export default function Home() {
  return (
    <div>
      <main>
        <>
          <Homepage />
          <HeroSection />
          <ReviewForm />
          <Footer />
        </>
      </main>
    </div>
  );
}
