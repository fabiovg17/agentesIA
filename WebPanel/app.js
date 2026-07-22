// =============================================
// ALMACENAMIENTO LOCAL DE USUARIOS
// =============================================
const STORAGE_KEY = 'panel_usuarios';

function cargarUsuarios() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  // Datos iniciales de muestra
  const iniciales = [
    { id: 1, nombre: 'Ana López',    email: 'ana@empresa.com',    rol: 'Admin',  estado: 'Activo',   creado: '2025-01-15' },
    { id: 2, nombre: 'Carlos Mora',  email: 'carlos@empresa.com', rol: 'Editor', estado: 'Activo',   creado: '2025-02-03' },
    { id: 3, nombre: 'María García', email: 'maria@empresa.com',  rol: 'Viewer', estado: 'Inactivo', creado: '2025-03-10' },
    { id: 4, nombre: 'Luis Vargas',  email: 'luis@empresa.com',   rol: 'Editor', estado: 'Activo',   creado: '2025-04-22' },
  ];
  guardarUsuarios(iniciales);
  return iniciales;
}

function guardarUsuarios(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

let usuarios = cargarUsuarios();
let nextId = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

// =============================================
// RENDERIZADO DE TABLA DE USUARIOS
// =============================================
function renderTablaUsuarios() {
  const busqueda = document.getElementById('search-usuarios').value.toLowerCase();
  const rolFiltro = document.getElementById('filter-rol').value;
  const estadoFiltro = document.getElementById('filter-estado').value;

  const filtrados = usuarios.filter(u => {
    const matchTexto = u.nombre.toLowerCase().includes(busqueda) || u.email.toLowerCase().includes(busqueda);
    const matchRol = !rolFiltro || u.rol === rolFiltro;
    const matchEstado = !estadoFiltro || u.estado === estadoFiltro;
    return matchTexto && matchRol && matchEstado;
  });

  const tbody = document.getElementById('usuarios-tbody');

  if (filtrados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">No se encontraron usuarios.</div></td></tr>`;
    document.getElementById('usuarios-count-label').textContent = '0 usuarios';
    return;
  }

  tbody.innerHTML = filtrados.map((u, i) => `
    <tr>
      <td style="color:var(--text-secondary)">${i + 1}</td>
      <td><strong>${u.nombre}</strong></td>
      <td style="color:var(--text-secondary)">${u.email}</td>
      <td>${badgeRol(u.rol)}</td>
      <td>${badgeEstado(u.estado)}</td>
      <td style="color:var(--text-secondary)">${formatFecha(u.creado)}</td>
      <td>
        <div class="actions">
          <button class="btn-edit" onclick="abrirEditar(${u.id})">Editar</button>
          <button class="btn-del"  onclick="abrirEliminar(${u.id})">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');

  document.getElementById('usuarios-count-label').textContent =
    `${filtrados.length} ${filtrados.length === 1 ? 'usuario' : 'usuarios'}`;

  actualizarMetricas();
}

function badgeRol(rol) {
  const clases = { Admin: 'danger', Editor: 'info', Viewer: 'gray' };
  return `<span class="badge ${clases[rol] || 'gray'}">${rol}</span>`;
}

function badgeEstado(estado) {
  return `<span class="badge ${estado === 'Activo' ? 'success' : 'warning'}">${estado}</span>`;
}

function formatFecha(fecha) {
  const d = new Date(fecha + 'T00:00:00');
  return d.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// =============================================
// MÉTRICAS DEL DASHBOARD
// =============================================
function actualizarMetricas() {
  document.getElementById('metric-usuarios').textContent = usuarios.length;
  document.getElementById('metric-admins').textContent = usuarios.filter(u => u.rol === 'Admin').length;
  document.getElementById('metric-activos').textContent = usuarios.filter(u => u.estado === 'Activo').length;
  document.getElementById('metric-inactivos').textContent = usuarios.filter(u => u.estado === 'Inactivo').length;
}

// =============================================
// MODAL CREAR / EDITAR
// =============================================
let modoEdicion = false;

function abrirModal(usuario = null) {
  modoEdicion = !!usuario;
  document.getElementById('modal-title').textContent = usuario ? 'Editar usuario' : 'Nuevo usuario';
  document.getElementById('usuario-id').value = usuario ? usuario.id : '';
  document.getElementById('input-nombre').value = usuario ? usuario.nombre : '';
  document.getElementById('input-email').value = usuario ? usuario.email : '';
  document.getElementById('input-rol').value = usuario ? usuario.rol : 'Viewer';
  document.getElementById('input-estado').value = usuario ? usuario.estado : 'Activo';
  document.getElementById('form-error').classList.add('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('input-nombre').focus();
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function abrirEditar(id) {
  const u = usuarios.find(u => u.id === id);
  if (u) abrirModal(u);
}

document.getElementById('btn-nuevo-usuario').addEventListener('click', () => abrirModal());
document.getElementById('btn-modal-close').addEventListener('click', cerrarModal);
document.getElementById('btn-cancelar').addEventListener('click', cerrarModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) cerrarModal();
});

document.getElementById('btn-guardar').addEventListener('click', () => {
  const nombre = document.getElementById('input-nombre').value.trim();
  const email  = document.getElementById('input-email').value.trim();
  const rol    = document.getElementById('input-rol').value;
  const estado = document.getElementById('input-estado').value;
  const error  = document.getElementById('form-error');

  if (!nombre || !email) {
    error.classList.remove('hidden');
    return;
  }
  error.classList.add('hidden');

  if (modoEdicion) {
    const id = parseInt(document.getElementById('usuario-id').value);
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx !== -1) usuarios[idx] = { ...usuarios[idx], nombre, email, rol, estado };
  } else {
    usuarios.push({
      id: nextId++,
      nombre, email, rol, estado,
      creado: new Date().toISOString().split('T')[0],
    });
  }

  guardarUsuarios(usuarios);
  cerrarModal();
  renderTablaUsuarios();
});

// =============================================
// MODAL CONFIRMAR ELIMINAR
// =============================================
let idAEliminar = null;

function abrirEliminar(id) {
  const u = usuarios.find(u => u.id === id);
  if (!u) return;
  idAEliminar = id;
  document.getElementById('confirm-nombre').textContent = u.nombre;
  document.getElementById('modal-confirm-overlay').classList.remove('hidden');
}

function cerrarConfirm() {
  idAEliminar = null;
  document.getElementById('modal-confirm-overlay').classList.add('hidden');
}

document.getElementById('btn-confirm-close').addEventListener('click', cerrarConfirm);
document.getElementById('btn-confirm-cancel').addEventListener('click', cerrarConfirm);
document.getElementById('modal-confirm-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-confirm-overlay')) cerrarConfirm();
});

document.getElementById('btn-confirm-delete').addEventListener('click', () => {
  if (idAEliminar === null) return;
  usuarios = usuarios.filter(u => u.id !== idAEliminar);
  guardarUsuarios(usuarios);
  cerrarConfirm();
  renderTablaUsuarios();
});

// =============================================
// FILTROS EN TIEMPO REAL
// =============================================
document.getElementById('search-usuarios').addEventListener('input', renderTablaUsuarios);
document.getElementById('filter-rol').addEventListener('change', renderTablaUsuarios);
document.getElementById('filter-estado').addEventListener('change', renderTablaUsuarios);

// =============================================
// NAVEGACIÓN ENTRE SECCIONES
// =============================================
const secciones = ['dashboard', 'usuarios', 'reportes', 'configuracion'];
const sectionTitles = { dashboard: 'Dashboard', usuarios: 'Usuarios', reportes: 'Reportes', configuracion: 'Configuración' };

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    document.getElementById('page-title').textContent = sectionTitles[section] || section;
    secciones.forEach(s => {
      const el = document.getElementById('section-' + s);
      if (el) el.classList.toggle('hidden', s !== section);
    });
    if (section === 'usuarios') renderTablaUsuarios();
  });
});

// =============================================
// BAR CHART
// =============================================
const chartData = [
  { day: 'Lun', visits: 320 }, { day: 'Mar', visits: 480 },
  { day: 'Mié', visits: 410 }, { day: 'Jue', visits: 560 },
  { day: 'Vie', visits: 720 }, { day: 'Sáb', visits: 390 },
  { day: 'Dom', visits: 210 },
];

function renderChart() {
  const container = document.getElementById('bar-chart');
  const labels = document.getElementById('bar-labels');
  const max = Math.max(...chartData.map(d => d.visits));
  container.innerHTML = '';
  labels.innerHTML = '';
  chartData.forEach(item => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = (item.visits / max * 100) + '%';
    bar.title = `${item.day}: ${item.visits} visitas`;
    container.appendChild(bar);
    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = item.day;
    labels.appendChild(label);
  });
}

// =============================================
// INIT
// =============================================
renderChart();
actualizarMetricas();
