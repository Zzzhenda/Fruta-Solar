// src/context/ProductContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Producto, productosIniciales } from '../data/productos';

// Definimos la interfaz del contexto para incluir las operaciones CRUD
interface ProductContextType {
  productos: Producto[];
  getProductoById: (id: string) => Producto | undefined;
  reducirStock: (id: string, cantidad: number) => void;
  agregarProducto: (producto: Producto) => void;    // <--- NUEVO
  editarProducto: (productoActualizado: Producto) => void; // <--- NUEVO
  eliminarProducto: (id: string) => void;          // <--- NUEVO
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);

  // Carga inicial de datos
  useEffect(() => {
    try {
      let storedProductos = JSON.parse(localStorage.getItem('productos') || 'null');
      if (!storedProductos || !Array.isArray(storedProductos) || storedProductos.length === 0) {
        localStorage.setItem('productos', JSON.stringify(productosIniciales));
        storedProductos = productosIniciales;
      }
      setProductos(storedProductos);
    } catch (error) {
      console.error("Error crítico al cargar productos:", error);
      setProductos(productosIniciales);
    }
  }, []);

  // Función auxiliar para persistir en localStorage
  const guardarEnStorage = (nuevosProductos: Producto[]) => {
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
  };

  const getProductoById = (id: string) => productos.find(p => p.id === id);

  const reducirStock = (id: string, cantidad: number) => {
    const nuevos = productos.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock - cantidad) } : p);
    guardarEnStorage(nuevos);
  };

  // --- OPERACIONES CRUD ---

  const agregarProducto = (nuevoProducto: Producto) => {
    // Usamos spread operator para añadir al final del array
    guardarEnStorage([...productos, nuevoProducto]);
  };

  const editarProducto = (productoActualizado: Producto) => {
    const nuevos = productos.map(p => p.id === productoActualizado.id ? productoActualizado : p);
    guardarEnStorage(nuevos);
  };

  const eliminarProducto = (id: string) => {
    const nuevos = productos.filter(p => p.id !== id);
    guardarEnStorage(nuevos);
  };

  const value = {
    productos,
    getProductoById,
    reducirStock,
    agregarProducto,
    editarProducto,
    eliminarProducto
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
}