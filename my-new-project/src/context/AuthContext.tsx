// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos';
import api from '../api/axiosConfig';

export interface CarritoItem extends Producto { cantidad: number; }
export interface Pedido { id: number; fecha: string; hora: string; productos: CarritoItem[]; total: number; estado: string; }
export interface Usuario { nombre: string; correo: string; telefono: string; direccion: string; password: string; rol: 'cliente' | 'administrador'; carrito: CarritoItem[]; pedidos: Pedido[]; }

interface AuthContextType {
  usuarioActual: Usuario | null;
  login: (correo: string, pass: string) => Promise<boolean>; 
  registro: (datos: any) => Promise<boolean>;
  logout: () => void;
  agregarPedido: (nuevoPedido: Pedido) => void;
  getAllPedidos: () => any[];
  actualizarEstadoPedido: (id: number, est: string) => void;
  getAllUsuarios: () => Usuario[];
  editarUsuario: (u: Usuario) => void;
  eliminarUsuario: (c: string) => boolean;
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

  // --- LOGIN REAL CONECTADO A JAVA ---
  const login = async (correo: string, pass: string) => {
    try {
      const response = await api.post('/auth/login', { username: correo, password: pass });
      const { token } = response.data;
      
      localStorage.setItem('jwt_token', token);
      
      // usuario simulado porque el backend de login solo devuelve token por ahora
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

  // Stubs para cumplir con la interfaz sin romper el código
  const registro = async () => true; 
  const agregarPedido = () => {};
  const getAllPedidos = () => [];
  const actualizarEstadoPedido = () => {};
  const getAllUsuarios = () => [];
  const editarUsuario = () => {};
  const eliminarUsuario = () => false;

  const value = { usuarioActual, login, registro, logout, agregarPedido, getAllPedidos, actualizarEstadoPedido, getAllUsuarios, editarUsuario, eliminarUsuario };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth error');
  return context;
}