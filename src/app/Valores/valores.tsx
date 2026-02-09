import Breadcrumbs from "@/components/Breadcrumbs";
export default function Valores() {
    const valores = [
                            "Innovación",
                            "Excelencia",
                            "Integridad",
                            "Colaboración",
                            "Adapatabilidad",
                            "Seguridad",
                            "Empatía",
                            "Inclusión",
                            "Compromiso Social",
                            "Respeto",
                            "Dignidad",
                            "Confianza"
                        ];

    return (
        <section>
            <Breadcrumbs />
            <div>
                <h1 className="hValores">Nuestros Valores</h1>
                    <ul className="lista-valores">
                        {valores.map((valor, index) => (
                            <li key={index}>{valor}</li>
                        ))}
                    </ul>
            </div>
        </section>
    )
}