// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos';
import api from '../api/axiosConfig';

export interface CarritoItem extends Producto { cantidad: number; }

export interface Pedido { 
  id: number; 
  fecha: string; 
  hora: string; 
  productos: CarritoItem[]; 
  total: number; 
  estado: string; 
}

export interface Usuario { 
  nombre: string; 
  correo: string; 
  telefono: string; 
  direccion: string; 
  password: string; 
  rol: 'cliente' | 'administrador'; 
  carrito: CarritoItem[]; 
  pedidos: Pedido[]; 
}

interface AuthContextType {
  usuarioActual: Usuario | null;
  login: (correo: string, pass: string) => Promise<boolean>;
  registro: (datos: any) => Promise<boolean>;
  logout: () => void;
  agregarPedido: (nuevoPedido: Pedido) => Promise<void>; 
  getAllPedidos: () => any[];
  actualizarEstadoPedido: (id: number, est: string) => void;
  getAllUsuarios: () => Usuario[];
  editarUsuario: (u: Usuario) => void;
  eliminarUsuario: (c: string) => boolean;
  actualizarDatosUsuario: (datos: any) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  // Verificar sesión al inicio
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const user = localStorage.getItem('user_data');
    if (token && user) setUsuarioActual(JSON.parse(user));
  }, []);

  const login = async (correo: string, pass: string) => {
    try {
      const response = await api.post('/auth/login', { username: correo, password: pass });
      const { token } = response.data;
      
      localStorage.setItem('jwt_token', token);
      
      // Simulamos datos de usuario decodificados del token o por defecto
      const usuarioSimulado: Usuario = {
        nombre: correo.split('@')[0],
        correo: correo,
        telefono: '', direccion: '', password: '',
        rol: correo.includes('admin') ? 'administrador' : 'cliente',
        carrito: [], pedidos: []
      };
      
      localStorage.setItem('user_data', JSON.stringify(usuarioSimulado));
      setUsuarioActual(usuarioSimulado);
      return true;
    } catch (e) {
      console.error("Login fallido", e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    setUsuarioActual(null);
    window.location.href = "/";
  };

  // --- INTEGRACIÓN DE PEDIDOS COMPLEJA (CORREGIDO) ---
  const agregarPedido = async (nuevoPedido: Pedido) => {
    if (!usuarioActual) return;

    try {
      // 1. Mapeamos los productos al formato 'DetalleOrden' de Java
      const detallesParaBackend = nuevoPedido.productos.map(prod => ({
        productoId: Number(prod.id), // Convertimos a número para el Long de Java
        cantidad: prod.cantidad,
        precioUnitario: prod.precio
      }));

      // 2. Preparamos el objeto Orden completo con la lista de detalles
      const ordenBackend = {
        cliente: usuarioActual.nombre,
        total: nuevoPedido.total,
        detalles: detallesParaBackend // ¡Aquí enviamos el detalle completo!
      };

      // 3. Enviamos al backend
      await api.post('/ordenes/generar', ordenBackend);

      // 4. Actualizamos visualmente el estado local
      const usuarioActualizado = {
        ...usuarioActual,
        pedidos: [...(usuarioActual.pedidos || []), nuevoPedido]
      };
      setUsuarioActual(usuarioActualizado);
      localStorage.setItem('user_data', JSON.stringify(usuarioActualizado));

    } catch (error) {
      console.error("Error enviando pedido complejo al backend", error);
    }
  };

  // Stubs para funciones secundarias (Se mantienen igual)
  const registro = async () => true; 
  const getAllPedidos = () => [];
  const actualizarEstadoPedido = () => {};
  const getAllUsuarios = () => [];
  const editarUsuario = () => {};
  const eliminarUsuario = () => false;
  const actualizarDatosUsuario = () => true;

  const value = { 
    usuarioActual, login, registro, logout, 
    agregarPedido, getAllPedidos, actualizarEstadoPedido, 
    getAllUsuarios, editarUsuario, eliminarUsuario, actualizarDatosUsuario 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth error');
  return context;
}