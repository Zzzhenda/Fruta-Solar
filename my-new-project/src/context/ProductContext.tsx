import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos';
import api from '../api/axiosConfig';
import { useNotification } from './NotificationContext';

interface ProductContextType {
  productos: Producto[];
  getProductoById: (id: string) => Producto | undefined;
  reducirStock: (id: string, cantidad: number) => void;
  agregarProducto: (producto: Producto) => Promise<void>;
  editarProducto: (productoActualizado: Producto) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
  recargarProductos: () => Promise<void>; // <--- NUEVO: Expuesto para uso global
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { addNotification } = useNotification();

  // Función para cargar productos desde el Backend
  const fetchProductos = async () => {
    try {
      const response = await api.get('/frutas');
      const productosAdaptados = response.data.map((p: any) => ({
        ...p,
        id: p.id.toString(),
        // Si la imagen viene vacía, ponemos un placeholder
        imagen: p.imagen && p.imagen.length > 5 ? p.imagen : "https://via.placeholder.com/150?text=Sin+Imagen"
      }));
      setProductos(productosAdaptados);
    } catch (error) {
      console.error("Error conectando con el Backend:", error);
      // No mostramos notificación de error constante para no molestar al usuario
    }
  };

  // Cargar al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  const getProductoById = (id: string) => productos.find(p => p.id === id);

  const agregarProducto = async (producto: Producto) => {
    try {
      const { id, ...productoSinId } = producto;
      await api.post('/frutas', productoSinId);
      await fetchProductos();
      addNotification("Producto creado exitosamente", "success");
    } catch (error) {
      console.error(error);
      addNotification("Error al crear producto", "danger");
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

  const reducirStock = () => { /* El backend maneja el stock real ahora */ };

  const value = {
    productos,
    getProductoById,
    reducirStock,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    recargarProductos: fetchProductos // <--- Exponemos la función
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  return context;
}