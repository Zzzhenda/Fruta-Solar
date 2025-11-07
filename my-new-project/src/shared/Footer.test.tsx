// src/shared/Footer.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer';

describe('Componente Footer', () => {
  it('renderiza el texto de derechos reservados', () => {
    // 1. Renderizar el componente en el DOM virtual
    render(<Footer />);
    
    // 2. Buscar el elemento (simulando cómo lo encontraría un usuario)
    // Usamos una expresión regular (/texto/i) para ignorar mayúsculas/minúsculas
    const copyrightElement = screen.getByText(/todos los derechos reservados/i);
    
    // 3. Aserción (verificar que existe)
    expect(copyrightElement).toBeInTheDocument();
  });

  it('contiene el año actual o el nombre de la empresa', () => {
    render(<Footer />);
    const companyElement = screen.getByText(/Fruto Solar/i);
    expect(companyElement).toBeInTheDocument();
  });
});