// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos';

export interface CarritoItem extends Producto {
  cantidad: number;
}

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
  login: (correo: string, pass: string) => boolean;
  registro: (datos: Omit<Usuario, 'rol' | 'carrito' | 'pedidos'>) => boolean;
  logout: () => void;
  agregarPedido: (nuevoPedido: Pedido) => void; // <--- NUEVA FUNCIÓN
}

const TIENDA_KEY = 'miTienda';

const getDatosTienda = (): { usuarioActual: string | null; usuarios: Usuario[] } => {
  let tienda = JSON.parse(localStorage.getItem(TIENDA_KEY) || 'null');
  if (!tienda) {
    const adminUser: Usuario = {
      correo: 'admin@frutosolar.cl',
      password: 'admin123',
      nombre: 'Administrador',
      rol: 'administrador',
      carrito: [],
      pedidos: [],
      telefono: '',
      direccion: ''
    };
    tienda = { usuarioActual: null, usuarios: [adminUser] };
    localStorage.setItem(TIENDA_KEY, JSON.stringify(tienda));
  }
  return tienda;
};

const setDatosTienda = (tienda: { usuarioActual: string | null; usuarios: Usuario[] }) => {
  localStorage.setItem(TIENDA_KEY, JSON.stringify(tienda));
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  useEffect(() => {
    const tienda = getDatosTienda();
    if (tienda.usuarioActual) {
      const usuario = tienda.usuarios.find(u => u.correo === tienda.usuarioActual);
      setUsuarioActual(usuario || null);
    }
  }, []);

  const login = (correo: string, pass: string) => {
    const tienda = getDatosTienda();
    const usuario = tienda.usuarios.find(u => u.correo === correo.toLowerCase() && u.password === pass);
    
    if (!usuario) return false;

    const carritoInvitado: CarritoItem[] = JSON.parse(localStorage.getItem("carritoInvitado") || '[]');
    if (carritoInvitado.length > 0) {
      if (!usuario.carrito) usuario.carrito = [];
      carritoInvitado.forEach(item => {
        const existente = usuario.carrito.find(p => p.id === item.id);
        if (existente) existente.cantidad += item.cantidad;
        else usuario.carrito.push(item);
      });
      localStorage.removeItem('carritoInvitado');
    }

    tienda.usuarioActual = usuario.correo;
    const userIndex = tienda.usuarios.findIndex(u => u.correo === usuario.correo);
    tienda.usuarios[userIndex] = usuario;
    
    setDatosTienda(tienda);
    setUsuarioActual(usuario);
    return true;
  };

  const registro = (datos: Omit<Usuario, 'rol' | 'carrito' | 'pedidos'>) => {
    const tienda = getDatosTienda();
    if (tienda.usuarios.some(u => u.correo === datos.correo.toLowerCase())) {
      return false;
    }

    const nuevoUsuario: Usuario = {
      ...datos,
      correo: datos.correo.toLowerCase(),
      rol: 'cliente',
      carrito: [],
      pedidos: []
    };

    tienda.usuarios.push(nuevoUsuario);
    setDatosTienda(tienda);
    return true;
  };

  const logout = () => {
    const tienda = getDatosTienda();
    tienda.usuarioActual = null;
    setDatosTienda(tienda);
    setUsuarioActual(null);
    localStorage.removeItem("carritoInvitado");
  };

  // Función para agregar un pedido al historial
  const agregarPedido = (nuevoPedido: Pedido) => {
    if (!usuarioActual) return;

    const tienda = getDatosTienda();
    const userIndex = tienda.usuarios.findIndex(u => u.correo === usuarioActual.correo);
    
    if (userIndex !== -1) {
      // Inicializar array de pedidos si no existe
      if (!tienda.usuarios[userIndex].pedidos) {
         tienda.usuarios[userIndex].pedidos = [];
      }
      // Agregar pedido
      tienda.usuarios[userIndex].pedidos.push(nuevoPedido);
      // Vaciar carrito en la BD
      tienda.usuarios[userIndex].carrito = [];
      
      setDatosTienda(tienda);
      
      // Actualizar estado local
      setUsuarioActual({
        ...usuarioActual,
        pedidos: [...(usuarioActual.pedidos || []), nuevoPedido],
        carrito: []
      });
    }
  };

  const value = {
    usuarioActual,
    login,
    registro,
    logout,
    agregarPedido
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}