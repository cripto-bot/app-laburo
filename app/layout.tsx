// app/layout.tsx
import type { Metadata } from 'next'; // Para definir metadatos de la página
import './globals.css'; // Importamos los estilos globales que acabamos de definir
// Más adelante, si usamos una fuente de Google Fonts, la importaríamos aquí también.

// 'Metadata' permite definir cosas como el título de la página, descripción, favicon, etc.
// que se aplicarán por defecto a todas las páginas de la aplicación.
export const metadata: Metadata = {
  title: 'Laburo - Tu Uber de Oficios', // Título que aparecerá en la pestaña del navegador
  description: 'Plataforma paraguaya para conectar personas que necesitan trabajos con prestadores disponibles en su zona.', // Descripción para SEO
  icons: [{ rel: 'icon', url: '/favicon.ico' }], // Enlace al favicon.ico (debería estar en public/favicon.ico)
};

// RootLayout es el componente principal que envuelve TODO el contenido de tu aplicación.
// Piensa en él como la plantilla HTML base (<html>, <head>, <body>).
export default function RootLayout({
  children, // 'children' representa el contenido de la página específica que se esté mostrando.
}: {
  children: React.ReactNode; // React.ReactNode significa que puede ser cualquier cosa que React pueda renderizar.
}) {
  return (
    <html lang="es"> {/* Es bueno declarar el idioma principal de tu sitio */}
      <body>
        {/* Aquí es donde Next.js colocará el contenido de tus archivos page.tsx */}
        {children}
      </body>
    </html>
  );
}
