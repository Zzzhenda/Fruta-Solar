// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Usuario, CarritoItem, Pedido } from './AuthContext';
import { useProducts } from './ProductContext';
import type { Producto } from '../data/productos';
import { useNotification } from './NotificationContext'; 

interface CartContextType {
  carrito: CarritoItem[];
  agregarAlCarrito: (producto: Producto) => boolean;
  quitarDelCarrito: (id: string) => void;
  actualizarCantidad: (id: string, nuevaCantidad: number) => void;
  vaciarCarrito: () => void;
  finalizarCompra: () => boolean;
  totalCarrito: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const { usuarioActual, agregarPedido } = useAuth();
  const { getProductoById, reducirStock } = useProducts();
  const { addNotification } = useNotification(); 

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
      addNotification("¡Producto agotado!", 'danger'); 
      return false;
    }

    const existente = carrito.find(item => item.id === producto.id);
    
    if (existente) {
      if (existente.cantidad >= productoEnStock.stock) {
        addNotification("No puedes agregar más, ¡stock máximo alcanzado!", 'warning'); 
        return false;
      }
      const nuevoCarrito = carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      guardarCarrito(nuevoCarrito);
    } else {
      guardarCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    addNotification(`"${producto.nombre}" agregado al carrito.`, 'success'); 
    return true;
  };

  const quitarDelCarrito = (id: string) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    guardarCarrito(nuevoCarrito);
    addNotification("Producto quitado del carrito", 'info'); // <-- REEMPLAZO
  };
  
  const actualizarCantidad = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(id); // quitarDelCarrito ya tiene notificación
      return;
    }
    
    const productoEnStock = getProductoById(id);
    if (productoEnStock && nuevaCantidad > productoEnStock.stock) {
      addNotification("No hay más stock disponible.", 'warning'); // <-- REEMPLAZO
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

  const finalizarCompra = () => {
    if (!usuarioActual || carrito.length === 0) return false;

    for (const item of carrito) {
      const productoReal = getProductoById(item.id);
      if (!productoReal || productoReal.stock < item.cantidad) {
        addNotification(`Error: No hay suficiente stock de ${item.nombre}`, 'danger'); // <-- REEMPLAZO
        return false;
      }
    }

    const nuevoPedido: Pedido = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      productos: [...carrito],
      total: totalCarrito,
      estado: 'Pendiente'
    };

    carrito.forEach(item => {
      reducirStock(item.id, item.cantidad);
    });

    agregarPedido(nuevoPedido);
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