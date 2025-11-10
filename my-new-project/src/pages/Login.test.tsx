import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Login } from './Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext'; // Necesario para que useAuth funcione

describe('Página de Login', () => {
  it('renderiza el formulario correctamente', () => {
    render(<BrowserRouter><AuthProvider><Login /></AuthProvider></BrowserRouter>);
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('permite escribir en los inputs', async () => {
    render(<BrowserRouter><AuthProvider><Login /></AuthProvider></BrowserRouter>);
    const emailInput = screen.getByLabelText(/Correo electrónico/i) as HTMLInputElement;
    await fireEvent.change(emailInput, { target: { value: 'test@user.com' } });
    expect(emailInput.value).toBe('test@user.com');
  });
});