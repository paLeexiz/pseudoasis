import * as React from 'react';
import { Html, Body, Container, Text, Button, Heading } from '@react-email/components';

interface VerificationEmailProps {
  verificationUrl: string;
  name?: string;
}

export default function VerificationEmail({
  verificationUrl,
  name = 'Usuario'
}: VerificationEmailProps) {
  return (
    <Html>
      <Body style={{ margin: 0, padding: 0, backgroundColor: '#f6f9fc' }}>
        <Container style={{
          margin: '0 auto',
          padding: '40px 20px',
          maxWidth: '600px',
          backgroundColor: '#ffffff',
          borderRadius: '8px'
        }}>
          <Heading style={{
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Verifica tu correo electrónico
          </Heading>

          <Text style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            Hola {name},
          </Text>

          <Text style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            Gracias por registrarte en A5I5.
            Para completar tu registro, por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo:
          </Text>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Button
              href={verificationUrl}
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                display: 'inline-block'
              }}
            >
              Verificar mi correo electrónico
            </Button>
          </div>
          <Text style={{
            fontSize: '14px',
            color: '#888',
            textAlign: 'center'
          }}>
            Si no solicitaste este registro, puedes ignorar este correo.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
