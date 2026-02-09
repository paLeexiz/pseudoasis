export default function Footer() {
  return (
    <footer className="bg-dark-purple text-white py-16 px-6 md:px-12 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
        
        <div className="space-y-6">
          <h3 className="font-headline text-2xl font-bold uppercase tracking-wide">
            A5I5
          </h3>
          <p className="font-body text-base leading-relaxed text-justify">
            A5I5 es una empresa dedicada a la gestión y desarrollo de software multiplataforma, ofreciendo soluciones con tecnologías actualizadas y ofreciendo calidad de primer nivel.
          </p>
        </div>

        {/* Columna 2 */}
        <div className="space-y-6">
          <h3 className="font-headline text-2xl font-bold text-white uppercase tracking-wide">
            Contáctanos
          </h3>
          <div className="space-y-4 font-body text-base text-justify">
            <p>
              <strong>Correo electronico:</strong><br />
              A5I5@gmail.com
            </p>
            <p>
              <strong>Teléfono:</strong><br />
              (227) 275 9300
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-purple-500/30 text-center">
        <p className="mt-8 text-sm text-white/80">
          © 2026 – A5I5
        </p>
      </div>
    </footer>
  );
}