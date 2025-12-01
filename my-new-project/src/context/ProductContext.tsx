// src/context/ProductContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos';
import api from '../api/axiosConfig'; // Usamos la conexión real

interface ProductContextType {
  productos: Producto[];
  getProductoById: (id: string) => Producto | undefined;
  reducirStock: (id: string, cantidad: number) => void;
  agregarProducto: (producto: Producto) => void;
  editarProducto: (productoActualizado: Producto) => void;
  eliminarProducto: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);

  // CARGAR PRODUCTOS DESDE EL BACKEND JAVA
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get('/frutas');
        // Adaptamos los datos de Java (ID numérico) a tu Frontend (ID string)
        const productosAdaptados = response.data.map((p: any) => ({
          ...p,
          id: p.id.toString(),
          // Si la imagen viene vacía de Java, ponemos una por defecto
          imagen: p.imagen && p.imagen.length > 5 ? p.imagen : "/images/manzana.png" 
        }));
        setProductos(productosAdaptados);
      } catch (error) {
        console.error("Error conectando con el Backend:", error);
      }
    };
    fetchProductos();
  }, []);

  const getProductoById = (id: string) => productos.find(p => p.id === id);

  // Funciones placeholder (se pueden conectar a la API después si hay tiempo)
  const reducirStock = () => {}; 
  const agregarProducto = () => {};
  const editarProducto = () => {};
  const eliminarProducto = () => {};

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
  if (context === undefined) throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  return context;
}