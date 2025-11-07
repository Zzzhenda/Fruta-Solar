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
  agregarPedido: (nuevoPedido: Pedido) => void;
  getAllPedidos: () => Array<Pedido & { clienteEmail: string; clienteNombre: string }>;
  actualizarEstadoPedido: (pedidoId: number, nuevoEstado: string) => void;
  // Nuevas funciones para gestión de usuarios
  getAllUsuarios: () => Usuario[];
  editarUsuario: (usuarioEditado: Usuario) => void;
  eliminarUsuario: (correoAEliminar: string) => boolean;
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

  const agregarPedido = (nuevoPedido: Pedido) => {
    if (!usuarioActual) return;
    const tienda = getDatosTienda();
    const userIndex = tienda.usuarios.findIndex(u => u.correo === usuarioActual.correo);

    if (userIndex !== -1) {
      if (!tienda.usuarios[userIndex].pedidos) tienda.usuarios[userIndex].pedidos = [];
      tienda.usuarios[userIndex].pedidos.push(nuevoPedido);
      tienda.usuarios[userIndex].carrito = [];
      setDatosTienda(tienda);
      setUsuarioActual({
        ...usuarioActual,
        pedidos: [...(usuarioActual.pedidos || []), nuevoPedido],
        carrito: []
      });
    }
  };

  const getAllPedidos = () => {
    const tienda = getDatosTienda();
    const todosLosPedidos: Array<Pedido & { clienteEmail: string; clienteNombre: string }> = [];
    tienda.usuarios.forEach(usuario => {
      if (usuario.pedidos) {
        usuario.pedidos.forEach(pedido => {
          todosLosPedidos.push({ ...pedido, clienteEmail: usuario.correo, clienteNombre: usuario.nombre });
        });
      }
    });
    return todosLosPedidos.sort((a, b) => b.id - a.id);
  };

  const actualizarEstadoPedido = (pedidoId: number, nuevoEstado: string) => {
    const tienda = getDatosTienda();
    let pedidoEncontrado = false;
    for (const usuario of tienda.usuarios) {
      if (!usuario.pedidos) continue;
      const pedidoIndex = usuario.pedidos.findIndex(p => p.id === pedidoId);
      if (pedidoIndex !== -1) {
        usuario.pedidos[pedidoIndex].estado = nuevoEstado;
        pedidoEncontrado = true;
        if (usuarioActual && usuario.correo === usuarioActual.correo) {
             const pedidosActualizados = [...usuarioActual.pedidos];
             const localIndex = pedidosActualizados.findIndex(p => p.id === pedidoId);
             if (localIndex !== -1) {
                 pedidosActualizados[localIndex] = { ...pedidosActualizados[localIndex], estado: nuevoEstado };
                 setUsuarioActual({ ...usuarioActual, pedidos: pedidosActualizados });
             }
        }
        break;
      }
    }
    if (pedidoEncontrado) setDatosTienda(tienda);
  };

  // --- GESTIÓN DE USUARIOS (NUEVO) ---

  const getAllUsuarios = () => {
    return getDatosTienda().usuarios;
  };

  const editarUsuario = (usuarioEditado: Usuario) => {
    const tienda = getDatosTienda();
    const idx = tienda.usuarios.findIndex(u => u.correo === usuarioEditado.correo);
    if (idx !== -1) {
       // Mantenemos carrito y pedidos originales para no perderlos al editar datos básicos
       tienda.usuarios[idx] = {
         ...usuarioEditado,
         carrito: tienda.usuarios[idx].carrito,
         pedidos: tienda.usuarios[idx].pedidos
       };
       setDatosTienda(tienda);
       // Si el admin se edita a sí mismo, actualizamos el estado local
       if (usuarioActual && usuarioActual.correo === usuarioEditado.correo) {
           setUsuarioActual(tienda.usuarios[idx]);
       }
    }
  };

  const eliminarUsuario = (correoAEliminar: string) => {
    // Validación de seguridad: no permitir auto-eliminación
    if (usuarioActual && usuarioActual.correo === correoAEliminar) {
        alert("No puedes eliminar tu propia cuenta de administrador mientras estás logueado.");
        return false;
    }
    const tienda = getDatosTienda();
    const nuevosUsuarios = tienda.usuarios.filter(u => u.correo !== correoAEliminar);
    
    if (nuevosUsuarios.length < tienda.usuarios.length) {
        tienda.usuarios = nuevosUsuarios;
        setDatosTienda(tienda);
        return true;
    }
    return false;
  };

  const value = {
    usuarioActual, login, registro, logout, agregarPedido,
    getAllPedidos, actualizarEstadoPedido,
    getAllUsuarios, editarUsuario, eliminarUsuario // <--- Exportamos las nuevas funciones
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
}