import type { MetaFunction } from "@remix-run/node";
import Header from "~/components/Header";
import Hero from "~/components/Hero";
import Destinations from "~/components/Destinations";
import Packages from "~/components/Packages";
import Footer from "~/components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivance Travels - Your Journey Begins Here" },
    {
      name: "description",
      content: "Find the best deals on flights, hotels, and holiday packages.",
    },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Destinations />
        <Packages />
      </main>
      <Footer />
    </div>
  );
}

