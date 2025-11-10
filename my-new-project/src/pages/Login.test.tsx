// src/pages/Login.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Login } from './Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext'; // <-- AÑADIR

describe('Página de Login', () => {
  // Preparamos un renderizado limpio
  const setup = () => {
    render(
      <BrowserRouter>
        <NotificationProvider> {/* <-- ENVOLVER */}
          <AuthProvider>
            <Login />
          </AuthProvider>
        </NotificationProvider> {/* <-- ENVOLVER */}
      </BrowserRouter>
    );
  };

  it('renderiza el formulario correctamente', () => {
    setup();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('permite escribir en los inputs', async () => {
    setup();
    const emailInput = screen.getByLabelText(/Correo electrónico/i) as HTMLInputElement;
    await fireEvent.change(emailInput, { target: { value: 'test@user.com' } });
    expect(emailInput.value).toBe('test@user.com');
  });

  it('muestra un mensaje de error si el login falla', async () => {
    setup();
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passInput = screen.getByLabelText(/Contraseña/i);
    const botonIngresar = screen.getByRole('button', { name: /Ingresar/i });

    await fireEvent.change(emailInput, { target: { value: 'usuario@incorrecto.com' } });
    await fireEvent.change(passInput, { target: { value: 'mala-clave' } });
    await fireEvent.click(botonIngresar);
    
    expect(screen.getByText(/Credenciales incorrectas/i)).toBeInTheDocument();
 });
});