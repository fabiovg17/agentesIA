// --- Bar chart data ---
const chartData = [
  { day: 'Lun', visits: 320 },
  { day: 'Mar', visits: 480 },
  { day: 'Mié', visits: 410 },
  { day: 'Jue', visits: 560 },
  { day: 'Vie', visits: 720 },
  { day: 'Sáb', visits: 390 },
  { day: 'Dom', visits: 210 },
];

function renderChart() {
  const container = document.getElementById('bar-chart');
  const labels = document.getElementById('bar-labels');
  const max = Math.max(...chartData.map(d => d.visits));

  container.innerHTML = '';
  labels.innerHTML = '';

  chartData.forEach(item => {
    const heightPct = (item.visits / max) * 100;
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = heightPct + '%';
    bar.title = `${item.day}: ${item.visits} visitas`;
    container.appendChild(bar);

    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = item.day;
    labels.appendChild(label);
  });
}

// --- Sidebar navigation ---
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');

const sectionTitles = {
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  reportes: 'Reportes',
  configuracion: 'Configuración',
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const section = item.dataset.section;
    pageTitle.textContent = sectionTitles[section] || section;
  });
});

// --- Refresh button: randomizes table badges ---
const statuses = ['success', 'warning', 'danger'];
const statusLabels = { success: 'Completado', warning: 'Pendiente', danger: 'Error' };

document.getElementById('btn-refresh').addEventListener('click', () => {
  const badges = document.querySelectorAll('#activity-table .badge');
  badges.forEach(badge => {
    const random = statuses[Math.floor(Math.random() * statuses.length)];
    badge.className = 'badge ' + random;
    badge.textContent = statusLabels[random];
  });

  // Also randomize metric values slightly
  const usuarios = document.getElementById('usuarios-count');
  const ingresos = document.getElementById('ingresos-count');
  const tareas = document.getElementById('tareas-count');

  usuarios.textContent = (1200 + Math.floor(Math.random() * 200)).toLocaleString();
  ingresos.textContent = '$' + (45000 + Math.floor(Math.random() * 8000)).toLocaleString();
  tareas.textContent = 30 + Math.floor(Math.random() * 20);
});

// --- Init ---
renderChart();
