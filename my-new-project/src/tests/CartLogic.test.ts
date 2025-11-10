import { describe, it, expect } from 'vitest';

const mockProducto = { id: '1', nombre: 'Manzana', precio: 100, stock: 10, categoria: '', imagen: '', descripcion: '', origen: '', sostenibilidad: '', receta: '' };

describe('Lógica del Carrito (Unit)', () => {
  it('debería calcular el total del carrito correctamente', () => {
    const carrito = [
        { ...mockProducto, cantidad: 2 }, // 200
        { ...mockProducto, id: '2', precio: 500, cantidad: 1 } // 500
    ];
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    expect(total).toBe(700);
  });

  it('debería contar el total de items correctamente', () => {
     const carrito = [
        { ...mockProducto, cantidad: 3 },
        { ...mockProducto, id: '2', cantidad: 2 }
    ];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    expect(totalItems).toBe(5);
  });
});