// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Usuario, CarritoItem, Pedido } from './AuthContext';
import { useProducts } from './ProductContext';
import type { Producto } from '../data/productos';

interface CartContextType {
  carrito: CarritoItem[];
  agregarAlCarrito: (producto: Producto) => boolean;
  quitarDelCarrito: (id: string) => void;
  actualizarCantidad: (id: string, nuevaCantidad: number) => void;
  vaciarCarrito: () => void;
  finalizarCompra: () => boolean; // <--- NUEVA FUNCIÓN
  totalCarrito: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  // Obtenemos las nuevas funciones de los otros contextos
  const { usuarioActual, agregarPedido } = useAuth();
  const { getProductoById, reducirStock } = useProducts();

  useEffect(() => {
    if (usuarioActual) {
      setCarrito(usuarioActual.carrito || []);
    } else {
      const carritoInvitado = JSON.parse(localStorage.getItem('carritoInvitado') || '[]');
      setCarrito(carritoInvitado);
    }
  }, [usuarioActual]);

  const guardarCarrito = (nuevoCarrito: CarritoItem[]) => {
    setCarrito(nuevoCarrito);

    if (usuarioActual) {
      const tienda = JSON.parse(localStorage.getItem('miTienda') || '{}');
      const userIndex = tienda.usuarios.findIndex((u: Usuario) => u.correo === usuarioActual.correo);
      if (userIndex !== -1) {
        tienda.usuarios[userIndex].carrito = nuevoCarrito;
        localStorage.setItem('miTienda', JSON.stringify(tienda));
      }
    } else {
      localStorage.setItem('carritoInvitado', JSON.stringify(nuevoCarrito));
    }
  };
  
  const agregarAlCarrito = (producto: Producto) => {
    const productoEnStock = getProductoById(producto.id);
    if (!productoEnStock || productoEnStock.stock <= 0) {
      alert("¡Producto agotado!");
      return false;
    }

    const existente = carrito.find(item => item.id === producto.id);
    
    if (existente) {
      if (existente.cantidad >= productoEnStock.stock) {
        alert("No puedes agregar más de este producto, ¡has alcanzado el stock máximo!");
        return false;
      }
      const nuevoCarrito = carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      guardarCarrito(nuevoCarrito);
    } else {
      guardarCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    alert(`Producto "${producto.nombre}" agregado al carrito.`);
    return true;
  };

  const quitarDelCarrito = (id: string) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    guardarCarrito(nuevoCarrito);
  };
  
  const actualizarCantidad = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(id);
      return;
    }
    
    const productoEnStock = getProductoById(id);
    if (productoEnStock && nuevaCantidad > productoEnStock.stock) {
      alert("No hay más stock disponible.");
      return;
    }

    const nuevoCarrito = carrito.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    guardarCarrito(nuevoCarrito);
  };
  
  const vaciarCarrito = () => {
    guardarCarrito([]);
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  // Lógica principal de compra
  const finalizarCompra = () => {
    if (!usuarioActual || carrito.length === 0) return false;

    // 1. Validar stock una última vez
    for (const item of carrito) {
      const productoReal = getProductoById(item.id);
      if (!productoReal || productoReal.stock < item.cantidad) {
        alert(`Error: No hay suficiente stock de ${item.nombre}`);
        return false;
      }
    }

    // 2. Crear el pedido
    const nuevoPedido: Pedido = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      productos: [...carrito],
      total: totalCarrito,
      estado: 'Pendiente'
    };

    // 3. Reducir stock
    carrito.forEach(item => {
      reducirStock(item.id, item.cantidad);
    });

    // 4. Guardar pedido
    agregarPedido(nuevoPedido);

    // 5. Vaciar carrito local
    setCarrito([]);
    localStorage.removeItem('carritoInvitado');

    return true;
  };

  const value = {
    carrito,
    agregarAlCarrito,
    quitarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    finalizarCompra,
    totalCarrito,
    totalItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}