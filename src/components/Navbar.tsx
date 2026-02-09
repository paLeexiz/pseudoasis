"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") setIsAuthenticated(true);
  }, []);
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert("Por favor, inicie sesión para acceder a esta sección.");
    } else {
      window.location.href = route;
    }
  }
  // const [open, setOpen] = useState(false);
  /**pruebas para hacer un navbar desplegable */
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-transparent backdrop-blur-sm">
      {/* Imagen del círculo con estrella */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
          <Image
            src="/images/logo-circulo.png"
            alt="Emblema SIELO"
            fill
            className="object-contain"
            priority
            quality={90}
          />
        </div>

        {/* Imagen del texto "sielo" a la derecha del círculo */}
        <div className="relative h-8 md:h-10 w-auto flex-shrink-0">
          <Image
            src="/images/letras.png"
            alt="SIELO"
            fill
            className="object-contain"
            priority
            quality={90}
          />
        </div>
      </div>

      <div className="flex items-center gap-10">
        <ul className="flex gap-8 text-off-white text-lg font-body">
          {/* <li>
            <button onClick={() => setOpen(!open)}>
              ¿Quiénes somos?
            </button>
            {open && (
              <ul className='submenu'>
                <li><a href="" className="hover:text-purple transition">¿Quienes Somos?</a></li>
          <li><a href="/Mision" className="hover:text-purple transition">Nuestra Misión</a></li>
          <li><a href="/Vision" className="hover:text-purple transition">Nuestra Visión</a></li>
          <li><a href="/Valores" className="hover:text-purple transition">Nuestros Valores</a></li>
              </ul>
            )}
          </li> */}
          <li><a href="/Mision" onClick={(e) => handleNavClick(e, "/Mision")} className="hover:text-purple transition">Nuestra Misión</a></li>
          <li><a href="/Vision" onClick={(e) => handleNavClick(e, "/Vision")} className="hover:text-purple transition">Nuestra Visión</a></li>
          <li><a href="/Valores" onClick={(e) => handleNavClick(e, "/Valores")} className="hover:text-purple transition">Nuestros Valores</a></li>
          <li><a href="/ContactForm" onClick={(e) => handleNavClick(e, "/ContactForm")} className='hover:text-purple transition'>Buzón</a></li>
        </ul>

        <button className="w-10 h-10 bg-light-purple/30 rounded-full flex items-center justify-center text-off-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
