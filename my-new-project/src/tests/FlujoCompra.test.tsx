// src/tests/FlujoCompra.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProductProvider } from '../context/ProductContext';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../shared/Navbar';
import { Catalogo } from '../pages/Catalogo';
import { NotificationProvider } from '../context/NotificationContext'; // <-- AÑADIR

// Wrapper completo que simula tu App.tsx
const renderApp = () => {
  render(
    <BrowserRouter>
      <NotificationProvider> {/* <-- ENVOLVER */}
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Navbar /> 
              <Catalogo />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </NotificationProvider> {/* <-- ENVOLVER */}
    </BrowserRouter>
  );
};

// Ya no necesitamos mockear 'alert'
// globalThis.alert = vi.fn();

describe('Flujo de Compra (Integración)', () => {

  it('Prueba 9: agrega un producto al carrito y el Navbar se actualiza', async () => {
    renderApp();
    const linkCarrito = screen.getByRole('link', { name: /Carrito/i });
    expect(linkCarrito).toBeInTheDocument();
    
    const botonesAgregar = await screen.findAllByRole('button', { name: /Agregar al Carrito/i });
    expect(botonesAgregar[0]).toBeInTheDocument();

    await fireEvent.click(botonesAgregar[0]);

    const badgeCarrito = screen.getByText('1');
    expect(badgeCarrito).toBeInTheDocument();
  });

});