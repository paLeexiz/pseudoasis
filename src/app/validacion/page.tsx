"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!token || !emailParam) {
      setStatus("error");
      setMessage("Enlace de verificación inválido o incompleto.");
      return;
    }

    setEmail(emailParam);
    verifyToken(token, emailParam);
  }, [searchParams]);

  const verifyToken = async (token: string, email: string) => {
    if (isVerifying) return;
    setIsVerifying(true);

    try {
      const res = await fetch(`/api/validacion?token=${token}&email=${encodeURIComponent(email)}`, {
        method: "GET",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage("¡Tu correo ha sido verificado correctamente!");

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "El token es inválido o ha expirado.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Error al conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container">
        <div className="card">
          <div className="form-box" style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2>Verificando tu correo electrónico...</h2>
            <p>Por favor espera un momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="form-box" style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2>
            {status === "success" ? "Verificación Exitosa" : "Verificación Fallida"}
          </h2>

          <p
            style={{
              fontSize: "18px",
              margin: "25px 0",
              color: status === "success" ? "#16a34a" : "#ef4444",
              lineHeight: "1.6"
            }}
          >
            {message}
          </p>

          {status === "success" && email && (
            <p style={{ marginBottom: "30px" }}>
              La cuenta asociada al correo <strong>{email}</strong> ha sido verificada.
            </p>
          )}

          <div style={{ marginTop: "30px" }}>
            {status === "success" ? (
              <Link href="/login">
                <button style={{ padding: "14px 32px", fontSize: "16px" }}>
                  Ir a Iniciar Sesión
                </button>
              </Link>
            ) : (
              <Link href="/registro">
                <button style={{ padding: "12px 28px" }}>
                  Volver al Registro
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ValidacionPage() {
  return (
    <Suspense
      fallback={
        <div className="container">
          <div className="card">
            <div className="form-box" style={{ textAlign: "center", padding: "60px 20px" }}>
              <h2>Cargando...</h2>
            </div>
          </div>
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
