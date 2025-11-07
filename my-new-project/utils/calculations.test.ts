// src/utils/calculations.test.ts
import { describe, it, expect } from 'vitest';

// Imaginemos una función simple que podrías tener en tu carrito
const calcularTotal = (precio: number, cantidad: number) => precio * cantidad;

describe('Cálculos de utilidad', () => {
  it('debe calcular correctamente el subtotal', () => {
    expect(calcularTotal(1000, 2)).toBe(2000);
    expect(calcularTotal(500, 0)).toBe(0);
  });
});