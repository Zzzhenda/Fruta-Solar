// src/tests/FlujoCompra.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProductProvider } from '../context/ProductContext';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../shared/Navbar';
import { Catalogo } from '../pages/Catalogo';

// Wrapper completo que simula tu App.tsx
const renderApp = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Navbar /> {/* Incluimos la Navbar para ver el carrito */}
            <Catalogo /> {/* La página que vamos a probar */}
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Mock de 'alert' para que no detenga el test
globalThis.alert = vi.fn();

describe('Flujo de Compra (Integración)', () => {

  it('Prueba 9: agrega un producto al carrito y el Navbar se actualiza', async () => {
    renderApp();

    // 1. Verificar estado inicial (Carrito en 0)
    // Buscamos el link "Carrito" (no el badge '0', porque no existe)
    const linkCarrito = screen.getByRole('link', { name: /Carrito/i });
    expect(linkCarrito).toBeInTheDocument();
    
    // 2. Encontrar el primer botón "Agregar al Carrito"
    // Usamos 'matchAll' para encontrar todos los botones y tomar el primero
    const botonesAgregar = await screen.findAllByRole('button', { name: /Agregar al Carrito/i });
    expect(botonesAgregar[0]).toBeInTheDocument(); // Asegura que el botón existe

    // 3. Simular clic del usuario
    await fireEvent.click(botonesAgregar[0]);

    // 4. Verificar el resultado
    // Ahora, el badge '1' del carrito DEBE existir en el Navbar
    const badgeCarrito = screen.getByText('1');
    expect(badgeCarrito).toBeInTheDocument();
  });

});