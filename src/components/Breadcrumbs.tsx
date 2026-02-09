"use client";

import { usePathname} from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const labels: {[key: string]: string} = {
        mision: "Misión",
        vision: "Visión",
        valores: "Valores",
        contactform: "Buzón"
    }

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol style={{fontSize: "1.5rem", fontWeight: "bold"}}>
                <li>
                    <Link href="/HeroSection">Principal</Link>
                </li>
                {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/");
                    const isLast = index === segments.length - 1;
                    const label = labels[segment.toLocaleLowerCase()] || segment;

                    return (
                        <li key={index}>
                            {">" }
                            {isLast ? (
                                <span className="breadcrumb-label">{label}</span>
                            ) : (
                                <Link href={href}>{label}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}