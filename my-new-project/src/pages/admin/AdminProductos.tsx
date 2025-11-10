// src/pages/admin/AdminProductos.tsx
import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import type { Producto } from '../../data/productos';
import { useNotification } from '../../context/NotificationContext';

const initialFormState: Producto = {
  id: '',
  nombre: '',
  precio: 0,
  stock: 0,
  categoria: 'Frutas Frescas',
  imagen: '/images/placeholder.png',
  descripcion: '',
  origen: 'Chile',
  sostenibilidad: '',
  receta: ''
};

export function AdminProductos() {
  const { productos, eliminarProducto, agregarProducto, editarProducto } = useProducts();
  const { usuarioActual } = useAuth();
  const { addNotification } = useNotification();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<Producto>(initialFormState);
  
  if (!usuarioActual || usuarioActual.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando) {
        editarProducto(form);
        addNotification('Producto actualizado correctamente', 'success');
      } else {
        agregarProducto({ ...form, id: Date.now().toString() });
        addNotification('Producto creado correctamente', 'success');
      }
      resetForm();
    } catch (error) {
      addNotification('Error al procesar la solicitud', 'danger');
    }
  };

  const handleEditarClick = (producto: Producto) => {
    setForm(producto);
    setEditando(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminarClick = (id: string) => {
    if (window.confirm('¿Estás absolutamente seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      eliminarProducto(id);
      addNotification('Producto eliminado', 'warning');
      if (form.id === id) {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditando(false);
  };

  return (
    <main className="container-fluid px-4 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}>Gestión de Productos</h1>
        <Link to="/admin" className="btn btn-outline-secondary">
          Volver al Panel
        </Link>
      </div>

      <div className="row g-4">
        {/* SECCIÓN 1: FORMULARIO */}
        <div className="col-lg-4">
          <div className={`card shadow-sm border-${editando ? 'warning' : 'success'}`}>
            <div className={`card-header text-white bg-${editando ? 'warning' : 'success'}`}>
              <h5 className="mb-0">{editando ? '✏️ Editando Producto' : '➕ Nuevo Producto'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {editando && (
                   <div className="mb-3">
                     <label className="form-label small text-muted">ID Interno</label>
                     <input type="text" className="form-control form-control-sm" value={form.id} readOnly disabled />
                   </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="nombre" required value={form.nombre} onChange={handleChange} />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label">Precio ($)</label>
                    <input type="number" className="form-control" name="precio" required min="0" value={form.precio} onChange={handleChange} />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-control" name="stock" required min="0" value={form.stock} onChange={handleChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" name="categoria" required value={form.categoria} onChange={handleChange}>
                    <option value="Frutas Frescas">Frutas Frescas</option>
                    <option value="Productos Orgánicos">Productos Orgánicos</option>
                    <option value="Lácteos y Orgánicos">Lácteos y Orgánicos</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">URL Imagen</label>
                  <input type="text" className="form-control" name="imagen" required value={form.imagen} onChange={handleChange} placeholder="/images/producto.png" />
                </div>
                <details className="mb-3">
                  <summary className="text-muted small">Detalles adicionales</summary>
                  <div className="mt-2 p-2 bg-light rounded">
                    <div className="mb-2">
                        <label className="form-label small">Descripción</label>
                        <textarea className="form-control form-control-sm" name="descripcion" rows={2} value={form.descripcion} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label className="form-label small">Origen</label>
                        <input type="text" className="form-control form-control-sm" name="origen" value={form.origen} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label className="form-label small">Sostenibilidad</label>
                        <input type="text" className="form-control form-control-sm" name="sostenibilidad" value={form.sostenibilidad} onChange={handleChange} />
                    </div>
                     <div className="mb-2">
                        <label className="form-label small">Receta sugerida</label>
                        <input type="text" className="form-control form-control-sm" name="receta" value={form.receta} onChange={handleChange} />
                    </div>
                  </div>
                </details>
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn btn-${editando ? 'warning' : 'success'}`}>
                    {editando ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                  {editando && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar Edición
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: TABLA DE LISTADO */}
        <div className="col-lg-8">
          {/* ¡ARREGLO AQUÍ! Se añadió 'admin-table-card' para el fix de CSS */}
          <div className="card shadow-sm border-0 admin-table-card">
            <div className="card-body p-0">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-end pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(producto => (
                    <tr key={producto.id} className={producto.stock === 0 ? 'table-danger' : ''}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <img src={producto.imagen} alt={producto.nombre}
                               width="40" height="40" className="rounded-circle me-3 border"
                               style={{objectFit: 'cover'}}
                               onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')} />
                          <div>
                            <div className="fw-bold">{producto.nombre}</div>
                            <small className="text-muted d-none d-lg-block text-truncate" style={{maxWidth: '200px'}}>
                              {producto.id}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark border">{producto.categoria}</span></td>
                      <td>${producto.precio.toLocaleString('es-CL')}</td>
                      <td>
                         {producto.stock > 10 ? (
                           <span className="text-success fw-bold">{producto.stock} u.</span>
                         ) : producto.stock > 0 ? (
                           <span className="text-warning fw-bold">{producto.stock} u.</span>
                         ) : (
                           <span className="badge bg-danger">Agotado</span>
                         )}
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <button onClick={() => handleEditarClick(producto)} className="btn btn-outline-primary" title="Editar">
                             ✏️
                          </button>
                          <button onClick={() => handleEliminarClick(producto.id)} className="btn btn-outline-danger" title="Eliminar">
                             🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {productos.length === 0 && (
                <div className="text-center py-5 text-muted">
                  No hay productos registrados.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}