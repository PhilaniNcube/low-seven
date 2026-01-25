import { BuildYourTour } from "@/components/home/build-your-tour";
import { Destinations } from "@/components/home/destinations";
import { Hero } from "@/components/home/hero";
import { TourPackages } from "@/components/home/tour-packages";
import { CTASection } from "@/components/home/cta-section";

export default function Page() {
return <>
   <Hero />
   <Destinations />
   <TourPackages />
   <BuildYourTour />
   <CTASection />
</>;
}