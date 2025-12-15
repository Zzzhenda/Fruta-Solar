import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos';
import api from '../api/axiosConfig';

export interface CarritoItem extends Producto { cantidad: number; }

export interface Pedido { 
  id: number; 
  fecha: string; 
  hora: string; 
  clienteNombre?: string; 
  clienteEmail?: string; 
  productos: CarritoItem[]; 
  total: number; 
  estado: string; 
}

export interface Usuario { 
  id?: number;
  nombre: string; 
  username: string; 
  telefono: string; 
  direccion: string; 
  password?: string; 
  rol: 'cliente' | 'administrador'; 
  roles?: string[]; 
  carrito?: CarritoItem[]; 
  pedidos?: Pedido[]; 
  correo: string; 
}

interface AuthContextType {
  usuarioActual: Usuario | null;
  login: (correo: string, pass: string) => Promise<boolean>;
  registro: (datos: any) => Promise<boolean>;
  logout: () => void;
  agregarPedido: (nuevoPedido: Pedido) => Promise<boolean>; 
  actualizarDatosUsuario: (datos: any) => boolean;
  getAllPedidos: () => Promise<Pedido[]>; 
  actualizarEstadoPedido: (id: number, estado: string) => Promise<boolean>;
  getAllUsuarios: () => Promise<Usuario[]>;
  editarUsuario: (u: Usuario) => Promise<void>;
  eliminarUsuario: (c: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const userStored = localStorage.getItem('user_data');
    if (token && userStored) {
        setUsuarioActual(JSON.parse(userStored));
    }
  }, []);

  const login = async (correo: string, pass: string) => {
    try {
      const response = await api.post('/auth/login', { username: correo, password: pass });
      const { token, usuario } = response.data;
      
      let rolNormalizado: 'cliente' | 'administrador' = 'cliente';
      if (usuario.roles && usuario.roles.includes('ROLE_ADMIN')) {
          rolNormalizado = 'administrador';
      }

      const usuarioFront: Usuario = {
          ...usuario,
          correo: usuario.username, 
          rol: rolNormalizado, 
          roles: usuario.roles 
      };

      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_data', JSON.stringify(usuarioFront));
      setUsuarioActual(usuarioFront);
      return true;
    } catch (e) {
      console.error("Error en login:", e);
      return false;
    }
  };

  const registro = async (datos: any) => {
    try {
        const payload = {
            nombre: datos.nombre,
            username: datos.correo, 
            password: datos.password,
            telefono: datos.telefono,
            direccion: datos.direccion,
            roles: ["ROLE_CLIENTE"]
        };
        await api.post('/auth/register', payload);
        return true;
    } catch (error) {
        console.error("Error en registro:", error);
        return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    setUsuarioActual(null);
    window.location.href = "/login";
  };

  const agregarPedido = async (nuevoPedido: Pedido) => {
    if (!usuarioActual) return false;
    try {
      const ordenBackend = {
        cliente: usuarioActual.nombre, 
        total: nuevoPedido.total,
        detalles: nuevoPedido.productos.map(prod => ({
            productoId: Number(prod.id), 
            cantidad: prod.cantidad,
            precioUnitario: prod.precio
        }))
      };
      
      await api.post('/ordenes/generar', ordenBackend);
      return true;
    } catch (error) {
      console.error("Error al crear la orden:", error);
      return false;
    }
  };

  const actualizarDatosUsuario = (datos: any) => {
      if(usuarioActual) {
          const actualizado = { ...usuarioActual, ...datos };
          setUsuarioActual(actualizado);
          localStorage.setItem('user_data', JSON.stringify(actualizado));
          return true;
      }
      return false;
  };

  // --- FUNCIÓN CORREGIDA PARA SOLUCIONAR EL $NaN ---
  const getAllPedidos = async (): Promise<Pedido[]> => {
    try {
      const res = await api.get('/ordenes');
      
      return res.data.map((o: any) => ({
        id: o.id,
        fecha: o.fecha ? o.fecha.split('T')[0] : 'N/A',
        hora: o.fecha ? o.fecha.split('T')[1].substring(0, 5) : 'N/A',
        clienteNombre: o.cliente,
        clienteEmail: 'Cliente Registrado',
        total: o.total,
        estado: o.estado,
        
        // AQUÍ ESTÁ EL MAPEO CLAVE:
        productos: o.detalles ? o.detalles.map((d: any) => ({
            id: d.productoId,
            // Obtenemos nombre del producto anidado o un fallback
            nombre: d.producto ? d.producto.nombre : `Producto #${d.productoId}`,
            cantidad: d.cantidad,
            // Asignamos 'precioUnitario' del backend a la propiedad 'precio' del frontend
            precio: d.precioUnitario 
        })) : []
      }));
    } catch (error) {
      console.error("Error obteniendo pedidos", error);
      return [];
    }
  };

  const actualizarEstadoPedido = async (id: number, estado: string) => {
    try {
      await api.patch(`/ordenes/${id}/estado?nuevoEstado=${estado}`);
      return true;
    } catch (error) {
      console.error("Error actualizando estado", error);
      return false;
    }
  };

  const getAllUsuarios = async (): Promise<Usuario[]> => {
    try {
      const res = await api.get('/usuarios'); 
      return res.data.map((u: any) => ({
        ...u,
        correo: u.username, 
        rol: u.roles && u.roles.includes('ROLE_ADMIN') ? 'administrador' : 'cliente'
      }));
    } catch (error) {
      console.error("Error obteniendo usuarios", error);
      return [];
    }
  };

  const editarUsuario = async (u: Usuario) => {
     console.log("Editar usuario no implementado en backend aún", u);
  };

  const eliminarUsuario = async (correo: string): Promise<boolean> => {
     console.log("Eliminar por correo requiere endpoint específico en backend", correo);
     return false; 
  };

  const value = { 
    usuarioActual, login, registro, logout, 
    agregarPedido, actualizarDatosUsuario,
    getAllPedidos, actualizarEstadoPedido, getAllUsuarios, editarUsuario, eliminarUsuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth error');
  return context;
}