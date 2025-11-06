// src/context/ProductContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Producto, productosIniciales } from '../data/productos';

interface ProductContextType {
  productos: Producto[];
  getProductoById: (id: string) => Producto | undefined;
  reducirStock: (id: string, cantidad: number) => void; // <--- NUEVA FUNCIÓN
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    try {
      let storedProductos = JSON.parse(localStorage.getItem('productos') || 'null');
      if (!storedProductos || storedProductos.length === 0) {
        localStorage.setItem('productos', JSON.stringify(productosIniciales));
        storedProductos = productosIniciales;
      }
      setProductos(storedProductos);
    } catch (error) {
      console.error("Error al cargar productos de localStorage:", error);
      setProductos(productosIniciales);
    }
  }, []);

  const getProductoById = (id: string) => {
    return productos.find(p => p.id === id);
  };

  // Función para reducir stock al comprar
  const reducirStock = (id: string, cantidad: number) => {
    const nuevosProductos = productos.map(p => {
      if (p.id === id) {
        // Aseguramos que el stock no baje de 0
        return { ...p, stock: Math.max(0, p.stock - cantidad) };
      }
      return p;
    });
    setProductos(nuevosProductos);
    // Guardamos el nuevo stock en localStorage
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
  };

  const value = {
    productos,
    getProductoById,
    reducirStock
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