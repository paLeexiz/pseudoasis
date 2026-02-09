import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
// import Problematica from "@/components/Problematica";

export default function InicioPage() {
  return (
    <>
      <Navbar />
      <HeroSection />

      <div className="min-h-screen bg-purple text-off-white flex flex-col items-center justify-center p-8">
        <p className="font-body text-xl md:text-2xl max-w-3xl text-center leading-relaxed">
          Es un proyecto diseñado para acompañar a las personas de la tercera edad mediante el uso de Inteligencia Artificial.
          El sistema permite que los usuarios expresen cómo se sienten emocionalmente y reciban respuestas empáticas y adecuadas,
          brindando apoyo y compañía en cualquier momento del día.
        </p>
      </div>
    </>
  );
}
