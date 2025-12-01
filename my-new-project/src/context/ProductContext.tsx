// src/context/ProductContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos';
import api from '../api/axiosConfig'; // Usamos la configuración real
import { useNotification } from './NotificationContext';

interface ProductContextType {
  productos: Producto[];
  getProductoById: (id: string) => Producto | undefined;
  reducirStock: (id: string, cantidad: number) => void;
  agregarProducto: (producto: Producto) => Promise<void>;
  editarProducto: (productoActualizado: Producto) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { addNotification } = useNotification();

  // Función para cargar productos desde el Backend
  const fetchProductos = async () => {
    try {
      const response = await api.get('/frutas');
      // Adaptamos los datos: El backend Java puede devolver ID numérico, el front usa string
      const productosAdaptados = response.data.map((p: any) => ({
        ...p,
        id: p.id.toString(),
        imagen: p.imagen && p.imagen.length > 5 ? p.imagen : "/images/manzana.png"
      }));
      setProductos(productosAdaptados);
    } catch (error) {
      console.error("Error conectando con el Backend:", error);
      addNotification("Error al cargar productos del servidor", "danger");
    }
  };

  // Cargar al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  const getProductoById = (id: string) => productos.find(p => p.id === id);

  // --- CRUD REAL: INTEGRACIÓN CON BACKEND ---

  const agregarProducto = async (producto: Producto) => {
    try {
      // Omitimos el ID porque la base de datos lo genera
      const { id, ...productoSinId } = producto;
      await api.post('/frutas', productoSinId);
      
      await fetchProductos(); // Recargamos la lista desde el servidor
      addNotification("Producto creado exitosamente", "success");
    } catch (error) {
      console.error(error);
      addNotification("Error al crear producto (Verifica permisos de Admin)", "danger");
    }
  };

  const editarProducto = async (producto: Producto) => {
    try {
      await api.put(`/frutas/${producto.id}`, producto);
      await fetchProductos();
      addNotification("Producto actualizado", "success");
    } catch (error) {
      console.error(error);
      addNotification("Error al editar producto", "danger");
    }
  };

  const eliminarProducto = async (id: string) => {
    try {
      await api.delete(`/frutas/${id}`);
      await fetchProductos();
      addNotification("Producto eliminado", "warning");
    } catch (error) {
      console.error(error);
      addNotification("Error al eliminar producto", "danger");
    }
  };

  const reducirStock = () => { /* Lógica opcional de stock local */ };

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