import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar'; // Asume que el test está en la misma carpeta 'shared'
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as CartContext from '../context/CartContext';

// Mock parcial de los hooks
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});
vi.mock('../context/CartContext', async () => {
    const actual = await vi.importActual('../context/CartContext');
    return { ...actual, useCart: vi.fn() };
});

describe('Navbar Component', () => {
  it('muestra enlace de Login cuando NO hay usuario', () => {
    (AuthContext.useAuth as any).mockReturnValue({ usuarioActual: null });
    (CartContext.useCart as any).mockReturnValue({ totalItems: 0 });

    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('muestra el nombre del usuario cuando SI está logueado', () => {
     (AuthContext.useAuth as any).mockReturnValue({
        usuarioActual: { nombre: 'Juanito Tester', rol: 'cliente' },
    });
    (CartContext.useCart as any).mockReturnValue({ totalItems: 5 });

    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText(/Hola, compa Tester/i)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Badge del carrito
  });
});