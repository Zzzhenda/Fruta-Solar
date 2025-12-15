import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as CartContext from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext'; 

// Mockeamos los módulos completos para poder espiar sus hooks
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

vi.mock('../context/CartContext', async () => {
  const actual = await vi.importActual('../context/CartContext');
  return { ...actual, useCart: vi.fn() };
});

const mockUseAuth = vi.mocked(AuthContext.useAuth);
const mockUseCart = vi.mocked(CartContext.useCart);

const renderNav = () => {
  render(
    <BrowserRouter>
      <NotificationProvider>
        <Navbar />
      </NotificationProvider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  it('muestra enlace de Login cuando NO hay usuario', () => {
    // Simulamos estado: Sin usuario
    mockUseAuth.mockReturnValue({ usuarioActual: null } as any);
    mockUseCart.mockReturnValue({ totalItems: 0 } as any);

    renderNav();
    // Buscamos el texto "Ingresar" que está en tu botón de login
    expect(screen.getByText(/Ingresar/i)).toBeInTheDocument();
  });

  it('muestra "Mi Cuenta" y badge del carrito cuando SI está logueado', () => {
    // Simulamos estado: Con usuario y 5 items
    mockUseAuth.mockReturnValue({
        usuarioActual: { nombre: 'Juanito Tester', rol: 'cliente' },
        logout: vi.fn() // Agregamos logout mockeado por si el navbar lo usa
    } as any);
    mockUseCart.mockReturnValue({ totalItems: 5 } as any);

    renderNav();

    // 1. Verificamos que aparezca el enlace al perfil ("Mi Cuenta")
    // Nota: El diseño actual muestra "Mi Cuenta", no el nombre completo en texto.
    expect(screen.getByText(/Mi Cuenta/i)).toBeInTheDocument();
    
    // 2. Verificamos que la inicial del usuario aparezca (opcional, si usas el círculo con inicial)
    expect(screen.getByText('J')).toBeInTheDocument();

    // 3. Verificamos el contador del carrito
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});