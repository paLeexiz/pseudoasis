'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const [showQueEsSielo, setShowQueEsSielo] = useState(false);
  const queEsRef = useRef<HTMLDivElement>(null);

  const toggleSection = () => {
    if (showQueEsSielo) {
      // Ocultar y subir al inicio
      setShowQueEsSielo(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowQueEsSielo(true);
      setTimeout(() => {
        if (queEsRef.current) {
          const offset = 80; // px de separación desde el navbar 
          const elementPosition = queEsRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <>
      {/* Hero principal */}
      <section className="relative min-h-screen flex items-start px-6 md:px-12 pt-20 md:pt-32">
        <div className="max-w-6xl w-full text-left z-10">
          <div className="hero-star">✦</div>

          <div className="hero-container">
            <h1 className="hero-title">A5I5</h1>
          </div>

          <p className="hero-description">
            Somos una empresa dedicada al desarrollo de software multiplataforma
            con un enfoque especial en la creación de soluciones innovadoras 
            para personas adultas mayores. Nuestro objetivo es mejorar la calidad de vida de este grupo a
             través de tecnologías accesibles, intuitivas y centradas en sus necesidades emocionales y sociales.
          </p>

          <div className="mt-8">
            <button onClick={toggleSection} className="hero-cta">
              {showQueEsSielo ? 'VER MENOS' : 'SABER MÁS...'}
            </button>
          </div>
        </div>
      {/* Hero principal 
        <div className="hero-logo-container">
          <Image
            src="/images/logo-pri.png"
            alt="SIELO Logo"
            width={320}
            height={320}
            className="w-full h-full object-contain"
            priority
            quality={85}
          />
        </div>*/}
      </section>

      {/* Sección Qué es*/}
      <div ref={queEsRef}>
        {showQueEsSielo && (
          <section className="py-16 md:py-20 px-6 md:px-12 bg-purple/10 backdrop-blur-sm animate-slideUp">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-headline text-4xl md:text-5xl font-black text-off-white uppercase tracking-tight mb-12 text-center">
                ¿QUÉ ES SIELO?
              </h2>

              <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 text-justify">
                {/* Columna izquierda */}
                <div className="space-y-6 md:pr-8">
                  <p className="que-es">
                    SIELO es una inteligencia artificial que conversa por voz con las personas adultas mayores, reconoce cómo se sienten emocionalmente y responde de manera cercana y comprensiva.
                  </p>

                  <p className="font-body text-lg text-cream/90 italic">
                    El nombre <span className="font-bold text-purple">SIELO</span> significa
                    <span className="font-headline text-purple"> Sistema de Inteligencia Emocional para la Longevidad</span>.
                  </p>

                  <p className="font-body text-lg text-cream leading-relaxed">
                    Representa la idea de acompañar, escuchar y cuidar las emociones a lo largo del tiempo, con una tecnología sencilla y humana.
                  </p>
                </div>

                {/* Columna derecha */}
                <div className="md:pl-12 lg:pl-16 border-l-4 border-purple/40 pl-8 md:pl-12">
                  <h3 className="font-headline text-2xl md:text-3xl text-off-white mb-6 text-center">
                    Enfoque principal
                  </h3>
                  <p className="enfoque">
                    SIELO se enfoca en la longevidad y la salud emocional, buscando que las personas adultas mayores se sientan acompañadas, escuchadas y valoradas, sin necesidad de usar tecnología complicada.
                  </p>
                  <p className="font-body text-lg text-cream leading-relaxed mt-6">
                    Es una herramienta que transforma una simple conversación en un vínculo de confianza y calma diaria.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}