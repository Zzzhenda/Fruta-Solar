// src/shared/Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as CartContext from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext'; // <-- AÑADIR

// ... (mocks)
const mockUseAuth = vi.mocked(AuthContext.useAuth);
const mockUseCart = vi.mocked(CartContext.useCart);

const renderNav = () => {
  render(
    <BrowserRouter>
      <NotificationProvider> {/* <-- ENVOLVER */}
        <Navbar />
      </NotificationProvider>
    </BrowserRouter>
  );
}

describe('Navbar Component', () => {
  it('muestra enlace de Login cuando NO hay usuario', () => {
    mockUseAuth.mockReturnValue({ usuarioActual: null } as any);
    mockUseCart.mockReturnValue({ totalItems: 0 } as any);

    renderNav();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('muestra el nombre del usuario cuando SI está logueado', () => {
     mockUseAuth.mockReturnValue({
        usuarioActual: { nombre: 'Juanito Tester', rol: 'cliente' },
    } as any);
    mockUseCart.mockReturnValue({ totalItems: 5 } as any);

    renderNav();
    expect(screen.getByText(/Hola, Juanito Tester/i)).toBeInTheDocument(); // <-- Corregido
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});