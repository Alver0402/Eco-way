// Configuración de la API
const API_BASE = 'http://localhost:4000/api';

// Estado de la aplicación
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Elementos DOM
const navLinks = document.getElementById('nav-links');
const profileLink = document.getElementById('profile-link');
const logoutLink = document.getElementById('logout-link');
const menuLink = document.createElement('a');
menuLink.href = '#';
menuLink.onclick = () => showPage('menu');
menuLink.textContent = 'Menú Principal';
menuLink.id = 'menu-link';
menuLink.style.display = 'none';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un token guardado
    if (authToken) {
        currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        updateNavigation(true);
        showPage('profile');
        loadProfile();
    } else {
        showPage('home');
    }

    // Configurar event listeners
    setupEventListeners();
    setupThemeToggle();
});

// Tema oscuro / claro removido, control manual por clases CSS
function setupThemeToggle() {
    // Ya no se usa botón específico; el color se ajusta desde variables CSS / theme selector.
}

// Configurar event listeners
function setupEventListeners() {
    // Formulario de registro
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Formulario de login
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Formulario de perfil
    document.getElementById('profile-form').addEventListener('submit', handleUpdateProfile);

    // Formulario de actividad
    document.getElementById('activity-form').addEventListener('submit', handleActivitySubmit);
}

// Navegación entre páginas
function showPage(pageId) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar página seleccionada
    document.getElementById(pageId + '-page').classList.add('active');

    // Actualizar URL sin recargar
    history.pushState(null, null, '#' + pageId);
}

// Actualizar navegación según estado de autenticación
function updateNavigation(isLoggedIn) {
    if (isLoggedIn) {
        menuLink.style.display = 'inline';
        profileLink.style.display = 'inline';
        logoutLink.style.display = 'inline';

        // Agregar enlace al menú si no está ya agregado
        if (!navLinks.contains(menuLink)) {
            navLinks.insertBefore(menuLink, profileLink);
        }
    } else {
        menuLink.style.display = 'none';
        profileLink.style.display = 'none';
        logoutLink.style.display = 'none';

        // Remover enlace del menú si existe
        if (navLinks.contains(menuLink)) {
            navLinks.removeChild(menuLink);
        }
    }
}

// Manejar registro
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const messageDiv = document.getElementById('register-message');

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.innerHTML = '<div class="message success">¡Registro exitoso! Ahora puedes iniciar sesión.</div>';
            document.getElementById('register-form').reset();
            setTimeout(() => showPage('login'), 2000);
        } else {
            messageDiv.innerHTML = `<div class="message error">${data.message}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<div class="message error">Error de conexión. Verifica que el servidor esté ejecutándose.</div>';
    }
}

// Manejar login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const messageDiv = document.getElementById('login-message');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);

            messageDiv.innerHTML = '<div class="message success">¡Inicio de sesión exitoso!</div>';

            // Cargar información del usuario
            await loadCurrentUser();
            updateNavigation(true);
            showPage('menu');
            loadDashboardData();
        } else {
            messageDiv.innerHTML = `<div class="message error">${data.message}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<div class="message error">Error de conexión. Verifica que el servidor esté ejecutándose.</div>';
    }
}

// Cargar información del usuario actual
async function loadCurrentUser() {
    try {
        const response = await fetch(`${API_BASE}/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (response.ok) {
            currentUser = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

// Cargar perfil
async function loadProfile() {
    if (!currentUser) return;

    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-edit-name').value = currentUser.name;
}

// Mostrar formulario de edición
function showEditForm() {
    document.querySelector('.profile-display').style.display = 'none';
    document.getElementById('profile-edit').style.display = 'block';
}

// Ocultar formulario de edición
function hideEditForm() {
    document.querySelector('.profile-display').style.display = 'block';
    document.getElementById('profile-edit').style.display = 'none';
    document.getElementById('profile-edit-name').value = currentUser.name;
}

// Manejar actualización de perfil
async function handleUpdateProfile(event) {
    event.preventDefault();

    const name = document.getElementById('profile-edit-name').value;
    const messageDiv = document.getElementById('profile-message');

    try {
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ name }),
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loadProfile();
            hideEditForm();
            messageDiv.innerHTML = '<div class="message success">Perfil actualizado correctamente.</div>';
            setTimeout(() => messageDiv.innerHTML = '', 3000);
        } else {
            messageDiv.innerHTML = `<div class="message error">${data.message}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<div class="message error">Error de conexión.</div>';
    }
}

// Cerrar sesión
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateNavigation(false);
    showPage('home');
}

// Cargar datos del dashboard
async function loadDashboardData() {
    if (!currentUser) return;

    // Verificar y actualizar racha antes de mostrar datos
    updateStreakStats();

    // Usar datos reales de racha
    document.getElementById('current-streak').textContent = streakData.currentStreak;
    document.getElementById('total-points').textContent = Math.floor(Math.random() * 1000) + 100;
    document.getElementById('activities-count').textContent = registeredActivities.length;
    document.getElementById('co2-saved').textContent = (streakData.currentStreak * 2.5).toFixed(1) + 'kg';
}

// Estado del calendario
let currentDate = new Date();
let selectedDate = null;
let registeredActivities = JSON.parse(localStorage.getItem('registeredActivities') || '[]');
let streakData = JSON.parse(localStorage.getItem('streakData') || '{}');

// Inicializar datos de racha si no existen
if (!streakData.currentStreak) streakData.currentStreak = 0;
if (!streakData.bestStreak) streakData.bestStreak = 0;
if (!streakData.lastActivityDate) streakData.lastActivityDate = null;
if (!streakData.streakStartDate) streakData.streakStartDate = null;

// Inicializar calendario cuando se carga la página de actividades
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...

    // Inicializar calendario cuando se muestra la página de actividades
    const activitiesPage = document.getElementById('activities-page');
    if (activitiesPage) {
        // Usar un observer para detectar cuando se muestra la página
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (activitiesPage.classList.contains('active')) {
                        initializeCalendar();
                        updateStreakStats();
                        updateActivitiesHistory();
                    }
                }
            });
        });
        observer.observe(activitiesPage, { attributes: true });
    }

    // Verificar racha cada hora para reinicio automático
    setInterval(() => {
        updateStreakStats();
    }, 60 * 60 * 1000); // Cada hora

    // Verificar racha al cargar la página
    updateStreakStats();
});

// Inicializar calendario
function initializeCalendar() {
    renderCalendar();
    setupCalendarEventListeners();
}

// Configurar event listeners del calendario
function setupCalendarEventListeners() {
    document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));

    // Event listeners del modal
    document.getElementById('cancel-confirm').addEventListener('click', closeConfirmationModal);
    document.getElementById('confirm-activity').addEventListener('click', confirmActivityRegistration);
}

// Navegar entre meses
function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Renderizar calendario
function renderCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const titleElement = document.getElementById('calendar-title');

    // Limpiar días anteriores (excepto headers)
    const dayElements = calendarGrid.querySelectorAll('.calendar-day');
    dayElements.forEach(el => el.remove());

    // Actualizar título
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    titleElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Obtener primer día del mes y último día
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // Generar días
    const currentDateObj = new Date();
    const today = new Date(currentDateObj.getFullYear(), currentDateObj.getMonth(), currentDateObj.getDate());

    for (let i = 0; i < 42; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        const dayNumber = currentDay.getDate();

        // Solo mostrar número si está en el mes actual
        if (currentDay.getMonth() === month) {
            dayElement.textContent = dayNumber;

            // Determinar el estado del día
            const dayKey = formatDateKey(currentDay);
            const isRegistered = registeredActivities.includes(dayKey);
            const isToday = currentDay.getTime() === today.getTime();
            const isPast = currentDay < today;
            const isFuture = currentDay > today;

            if (isRegistered) {
                dayElement.classList.add('completed');
            } else if (isToday) {
                dayElement.classList.add('today');
                dayElement.classList.add('available');
            } else if (isFuture) {
                dayElement.classList.add('available');
            } else {
                dayElement.classList.add('disabled');
            }

            // Agregar event listener solo para días disponibles
            if (!isPast || isToday) {
                dayElement.addEventListener('click', () => selectDate(currentDay, dayKey, isRegistered));
            }
        }

        calendarGrid.appendChild(dayElement);
    }
}

// Formatear fecha como clave para almacenamiento
function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Formatear fecha para display
function formatDisplayDate(date) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    return `${dayNames[date.getDay()]} ${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
}

// Seleccionar fecha
function selectDate(date, dateKey, isRegistered) {
    if (isRegistered) {
        showMessage('activities-message', 'Ya has registrado una actividad para este día.', 'info');
        return;
    }

    selectedDate = { date, dateKey };
    showConfirmationModal(date);
}

// Mostrar modal de confirmación
function showConfirmationModal(date) {
    const modal = document.getElementById('confirmation-modal');
    const confirmDateElement = document.getElementById('confirm-date');

    confirmDateElement.textContent = formatDisplayDate(date);
    modal.style.display = 'block';
}

// Cerrar modal de confirmación
function closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'none';
    selectedDate = null;
}

// Confirmar registro de actividad
function confirmActivityRegistration() {
    if (!selectedDate) return;

    const { dateKey } = selectedDate;

    // Verificar nuevamente si ya está registrado (por si acaso)
    if (registeredActivities.includes(dateKey)) {
        showMessage('activities-message', 'Esta fecha ya está registrada.', 'error');
        closeConfirmationModal();
        return;
    }

    // Registrar la actividad
    registeredActivities.push(dateKey);
    localStorage.setItem('registeredActivities', JSON.stringify(registeredActivities));

    // Incrementar racha
    incrementStreak(new Date(dateKey));

    // Cerrar modal
    closeConfirmationModal();

    // Actualizar UI
    renderCalendar();
    updateStreakStats();
    updateActivitiesHistory();

    // Mostrar mensaje de éxito
    showMessage('activities-message', '¡Actividad registrada exitosamente! 🔥 Racha actualizada.', 'success');
}

// Actualizar estadísticas de racha
function updateStreakStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Verificar si la racha debe reiniciarse (más de 24 horas sin actividad)
    checkAndResetStreak(today);

    // Calcular racha actual desde la última actividad
    let currentStreak = streakData.currentStreak;

    // Calcular total del mes actual
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    let totalThisMonth = 0;

    registeredActivities.forEach(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        if (year === currentYear && month - 1 === currentMonth) {
            totalThisMonth++;
        }
    });

    // La mejor racha ya se mantiene en streakData.bestStreak

    // Actualizar DOM
    document.getElementById('current-streak').textContent = currentStreak;
    document.getElementById('total-days').textContent = totalThisMonth;
    document.getElementById('best-streak').textContent = streakData.bestStreak;

    // Sincronizar con servidor (cuando esté disponible)
    syncStreakWithServer();
}

// Verificar y reiniciar racha si han pasado más de 24 horas
function checkAndResetStreak(today) {
    if (!streakData.lastActivityDate) {
        return; // No hay actividad previa
    }

    const lastActivity = new Date(streakData.lastActivityDate);
    const hoursSinceLastActivity = (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    // Si han pasado más de 24 horas desde la última actividad, reiniciar racha
    if (hoursSinceLastActivity > 24) {
        // Guardar la mejor racha antes de reiniciar
        if (streakData.currentStreak > streakData.bestStreak) {
            streakData.bestStreak = streakData.currentStreak;
        }

        // Reiniciar racha
        const oldStreak = streakData.currentStreak;
        streakData.currentStreak = 0;
        streakData.streakStartDate = null;

        // Guardar cambios
        localStorage.setItem('streakData', JSON.stringify(streakData));

        // Mostrar notificación de reinicio si la racha era significativa
        if (oldStreak > 0) {
            showStreakNotification(`¡Tu racha de ${oldStreak} días se reinició! Registra una actividad hoy para comenzar una nueva.`, 'warning');
        }

        console.log('Racha reiniciada automáticamente después de 24 horas sin actividad');
    } else if (hoursSinceLastActivity > 20) {
        // Advertencia cuando quedan menos de 4 horas
        const hoursLeft = Math.ceil(24 - hoursSinceLastActivity);
        showStreakNotification(`⚠️ Tu racha actual se reiniciará en ${hoursLeft} horas si no registras actividad.`, 'info');
    }
}

// Mostrar notificaciones de racha
function showStreakNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `streak-notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    // Agregar al DOM
    document.body.appendChild(notification);

    // Auto-remover después de 10 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// Función de prueba para el sistema de rachas (accesible desde consola del navegador)
window.testStreakSystem = function() {
    console.log('=== PRUEBA DEL SISTEMA DE RACHAS ===');
    console.log('Datos actuales de racha:', streakData);
    console.log('Actividades registradas:', registeredActivities);

    // Simular registro de actividad de hoy
    const today = new Date();
    const todayKey = formatDateKey(today);

    if (!registeredActivities.includes(todayKey)) {
        console.log('Registrando actividad para hoy...');
        incrementStreak(today);
        registeredActivities.push(todayKey);
        localStorage.setItem('registeredActivities', JSON.stringify(registeredActivities));
        updateStreakStats();
        console.log('Actividad registrada. Nueva racha:', streakData.currentStreak);
    } else {
        console.log('Ya hay actividad registrada para hoy');
    }

    // Mostrar estadísticas
    console.log('Estadísticas finales:', {
        currentStreak: streakData.currentStreak,
        bestStreak: streakData.bestStreak,
        lastActivity: streakData.lastActivityDate,
        totalActivities: registeredActivities.length
    });
};

// ==========================================
// SISTEMA DE PUNTOS DE RECICLAJE
// ==========================================

// Base de datos de puntos de reciclaje
const recyclingPoints = [
    {
        id: 1,
        name: "Centro de Acopio EAAB Chapinero",
        address: "Calle 13 # 27-74, Chapinero, Bogotá",
        coordinates: { lat: 4.6561, lng: -74.0544 },
        phone: "+57 1 3245000",
        materials: ["plastico", "papel", "vidrio", "metales", "electronicos"],
        schedule: {
            monday: "08:00-17:00",
            tuesday: "08:00-17:00",
            wednesday: "08:00-17:00",
            thursday: "08:00-17:00",
            friday: "08:00-17:00",
            saturday: "08:00-12:00",
            sunday: "Cerrado"
        },
        specialNotes: "Centro principal de acopio de la EAAB, acepta todo tipo de reciclables",
        lastUpdated: "2024-03-22"
    },
    {
        id: 2,
        name: "Punto Verde Parque Nacional",
        address: "Carrera 7 # 36-00, Parque Nacional, Bogotá",
        coordinates: { lat: 4.6114, lng: -74.0681 },
        phone: "+57 1 3778899",
        materials: ["plastico", "papel", "vidrio", "organicos"],
        schedule: {
            monday: "06:00-18:00",
            tuesday: "06:00-18:00",
            wednesday: "06:00-18:00",
            thursday: "06:00-18:00",
            friday: "06:00-18:00",
            saturday: "07:00-17:00",
            sunday: "07:00-17:00"
        },
        specialNotes: "Punto verde en parque principal, incluye compostaje comunitario",
        lastUpdated: "2024-03-20"
    },
    {
        id: 3,
        name: "Centro de Reciclaje Ciudad Bolívar",
        address: "Carrera 72D # 39-40 Sur, Ciudad Bolívar, Bogotá",
        coordinates: { lat: 4.5494, lng: -74.1522 },
        phone: "+57 1 3245100",
        materials: ["plastico", "papel", "vidrio", "metales", "organicos"],
        schedule: {
            monday: "08:00-16:00",
            tuesday: "08:00-16:00",
            wednesday: "08:00-16:00",
            thursday: "08:00-16:00",
            friday: "08:00-16:00",
            saturday: "09:00-14:00",
            sunday: "Cerrado"
        },
        specialNotes: "Centro especializado en reciclaje de barrio",
        lastUpdated: "2024-03-21"
    },
    {
        id: 4,
        name: "Punto de Reciclaje Usaquén",
        address: "Carrera 6 # 119-50, Usaquén, Bogotá",
        coordinates: { lat: 4.6958, lng: -74.0317 },
        phone: "+57 1 3245200",
        materials: ["plastico", "papel", "vidrio", "electronicos"],
        schedule: {
            monday: "07:00-19:00",
            tuesday: "07:00-19:00",
            wednesday: "07:00-19:00",
            thursday: "07:00-19:00",
            friday: "07:00-19:00",
            saturday: "08:00-16:00",
            sunday: "Cerrado"
        },
        specialNotes: "Punto de reciclaje en zona norte, enfocado en electrónicos",
        lastUpdated: "2024-03-19"
    },
    {
        id: 5,
        name: "Centro Ambiental Suba",
        address: "Carrera 91 # 146-40, Suba, Bogotá",
        coordinates: { lat: 4.7425, lng: -74.0861 },
        phone: "+57 1 3245300",
        materials: ["organicos", "plastico", "papel", "metales"],
        schedule: {
            monday: "08:00-17:00",
            tuesday: "08:00-17:00",
            wednesday: "08:00-17:00",
            thursday: "08:00-17:00",
            friday: "08:00-17:00",
            saturday: "09:00-13:00",
            sunday: "Cerrado"
        },
        specialNotes: "Centro ambiental con énfasis en compostaje",
        lastUpdated: "2024-03-22"
    },
    {
        id: 6,
        name: "Punto Verde Kennedy",
        address: "Carrera 78 # 38-40 Sur, Kennedy, Bogotá",
        coordinates: { lat: 4.6289, lng: -74.1611 },
        phone: "+57 1 3245400",
        materials: ["plastico", "papel", "vidrio", "organicos", "metales"],
        schedule: {
            monday: "07:00-18:00",
            tuesday: "07:00-18:00",
            wednesday: "07:00-18:00",
            thursday: "07:00-18:00",
            friday: "07:00-18:00",
            saturday: "08:00-15:00",
            sunday: "08:00-15:00"
        },
        specialNotes: "Punto verde principal del sur de la ciudad",
        lastUpdated: "2024-03-20"
    },
    {
        id: 7,
        name: "Centro de Acopio Fontibón",
        address: "Carrera 100 # 22-30, Fontibón, Bogotá",
        coordinates: { lat: 4.6789, lng: -74.1422 },
        phone: "+57 1 3245500",
        materials: ["electronicos", "baterias", "metales", "plastico"],
        schedule: {
            monday: "08:00-16:00",
            tuesday: "08:00-16:00",
            wednesday: "08:00-16:00",
            thursday: "08:00-16:00",
            friday: "08:00-16:00",
            saturday: "Cerrado",
            sunday: "Cerrado"
        },
        specialNotes: "Especializado en residuos electrónicos y peligrosos",
        lastUpdated: "2024-03-21"
    },
    {
        id: 8,
        name: "Punto de Reciclaje Teusaquillo",
        address: "Carrera 10 # 25-36, Teusaquillo, Bogotá",
        coordinates: { lat: 4.6358, lng: -74.0778 },
        phone: "+57 1 3245600",
        materials: ["papel", "vidrio", "plastico", "organicos"],
        schedule: {
            monday: "06:00-20:00",
            tuesday: "06:00-20:00",
            wednesday: "06:00-20:00",
            thursday: "06:00-20:00",
            friday: "06:00-20:00",
            saturday: "07:00-18:00",
            sunday: "Cerrado"
        },
        specialNotes: "Punto central con horarios extendidos",
        lastUpdated: "2024-03-19"
    }
];

// Estado de filtros
let currentFilters = {
    search: '',
    material: '',
    schedule: ''
};

// Inicializar página de puntos de reciclaje
function initializeRecyclingPoints() {
    setupPointsEventListeners();
    loadRecyclingPoints();
    updatePointsStats();
}

// Configurar event listeners para puntos de reciclaje
function setupPointsEventListeners() {
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('location-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    document.getElementById('material-filter').addEventListener('change', handleFilter);
    document.getElementById('schedule-filter').addEventListener('change', handleFilter);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    document.getElementById('reset-search').addEventListener('click', resetSearch);
}

// Manejar búsqueda
function handleSearch() {
    const searchTerm = document.getElementById('location-search').value.toLowerCase();
    currentFilters.search = searchTerm;
    loadRecyclingPoints();
}

// Manejar filtros
function handleFilter() {
    currentFilters.material = document.getElementById('material-filter').value;
    currentFilters.schedule = document.getElementById('schedule-filter').value;
    loadRecyclingPoints();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('location-search').value = '';
    document.getElementById('material-filter').value = '';
    document.getElementById('schedule-filter').value = '';
    currentFilters = { search: '', material: '', schedule: '' };
    loadRecyclingPoints();
}

// Reset search
function resetSearch() {
    clearFilters();
    document.getElementById('no-results').style.display = 'none';
}

// Cargar y mostrar puntos de reciclaje
function loadRecyclingPoints() {
    const filteredPoints = filterRecyclingPoints();
    const container = document.getElementById('recycling-points-list');
    const noResults = document.getElementById('no-results');

    if (filteredPoints.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    container.innerHTML = filteredPoints.map(point => createPointCard(point)).join('');
}

// Filtrar puntos de reciclaje
function filterRecyclingPoints() {
    return recyclingPoints.filter(point => {
        // Filtro de búsqueda por texto
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            const matchesSearch = point.name.toLowerCase().includes(searchLower) ||
                                point.address.toLowerCase().includes(searchLower) ||
                                point.materials.some(material => material.toLowerCase().includes(searchLower));
            if (!matchesSearch) return false;
        }

        // Filtro por material
        if (currentFilters.material) {
            if (!point.materials.includes(currentFilters.material)) return false;
        }

        // Filtro por horario
        if (currentFilters.schedule) {
            const isOpen = checkPointSchedule(point, currentFilters.schedule);
            if (!isOpen) return false;
        }

        return true;
    });
}

// Verificar horario del punto
function checkPointSchedule(point, scheduleType) {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes();

    // Mapear días de la semana
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todaySchedule = point.schedule[dayMap[dayOfWeek]];

    if (todaySchedule === 'Cerrado') return false;

    if (scheduleType === '24h') {
        return todaySchedule.includes('24') || todaySchedule === '07:00-21:00';
    }

    if (scheduleType === 'weekday') {
        return dayOfWeek >= 1 && dayOfWeek <= 5 && todaySchedule !== 'Cerrado';
    }

    if (scheduleType === 'weekend') {
        return dayOfWeek === 0 || dayOfWeek === 6;
    }

    return true;
}

// Crear tarjeta de punto de reciclaje
function createPointCard(point) {
    const isOpen = checkPointSchedule(point, 'current');
    const materialsText = point.materials.map(material => {
        const materialNames = {
            'plastico': 'Plástico',
            'papel': 'Papel',
            'vidrio': 'Vidrio',
            'organicos': 'Orgánicos',
            'electronicos': 'Electrónicos',
            'metales': 'Metales',
            'baterias': 'Baterías'
        };
        return `<span class="material-tag">${materialNames[material] || material}</span>`;
    }).join('');

    const scheduleText = formatSchedule(point.schedule);

    return `
        <div class="point-card" data-id="${point.id}">
            <div class="point-header">
                <h3>${point.name}</h3>
                <span class="point-status ${isOpen ? 'open' : 'closed'}">
                    ${isOpen ? 'Abierto' : 'Cerrado'}
                </span>
            </div>
            <div class="point-content">
                <div class="point-info">
                    <div class="info-item">
                        <span class="icon">📍</span>
                        <div class="content">
                            <strong>Dirección</strong>
                            <span>${point.address}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="icon">📞</span>
                        <div class="content">
                            <strong>Teléfono</strong>
                            <span>${point.phone}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="icon">🕒</span>
                        <div class="content">
                            <strong>Horarios</strong>
                            <span>${scheduleText}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="icon">♻️</span>
                        <div class="content">
                            <strong>Materiales aceptados</strong>
                            <div class="materials-list">${materialsText}</div>
                        </div>
                    </div>
                    ${point.specialNotes ? `
                    <div class="info-item">
                        <span class="icon">ℹ️</span>
                        <div class="content">
                            <strong>Notas especiales</strong>
                            <span>${point.specialNotes}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="point-actions">
                    <button class="btn-secondary" onclick="openInMaps(${point.coordinates.lat}, ${point.coordinates.lng})">
                        🗺️ Ver en Mapa
                    </button>
                    <button class="btn-primary" onclick="callPoint('${point.phone}')">
                        📞 Llamar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Formatear horario para display
function formatSchedule(schedule) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let formatted = '';

    // Verificar si todos los días tienen el mismo horario
    const uniqueSchedules = [...new Set(Object.values(schedule))];
    if (uniqueSchedules.length === 1 && uniqueSchedules[0] !== 'Cerrado') {
        return `Todos los días: ${uniqueSchedules[0]}`;
    }

    // Mostrar horario por día
    for (let i = 1; i <= 5; i++) { // Lunes a Viernes
        if (schedule[Object.keys(schedule)[i]] !== 'Cerrado') {
            formatted = `Lunes a Viernes: ${schedule[Object.keys(schedule)[1]]}`;
            break;
        }
    }

    // Sábado
    if (schedule.saturday !== 'Cerrado') {
        formatted += formatted ? ' | ' : '';
        formatted += `Sábado: ${schedule.saturday}`;
    }

    // Domingo
    if (schedule.sunday !== 'Cerrado') {
        formatted += formatted ? ' | ' : '';
        formatted += `Domingo: ${schedule.sunday}`;
    }

    return formatted || 'Horarios variables';
}

// Actualizar estadísticas de puntos
function updatePointsStats() {
    const now = new Date();
    const totalPoints = recyclingPoints.length;
    const openNow = recyclingPoints.filter(point => checkPointSchedule(point, 'current')).length;
    const acceptsPlastic = recyclingPoints.filter(point => point.materials.includes('plastico')).length;

    document.getElementById('total-points-count').textContent = totalPoints;
    document.getElementById('open-now-count').textContent = openNow;
    document.getElementById('accepts-plastic-count').textContent = acceptsPlastic;
}

// Abrir en mapas
function openInMaps(lat, lng) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
}

// Llamar al punto
function callPoint(phone) {
    window.location.href = `tel:${phone}`;
}

// Inicializar puntos cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...

    // Inicializar puntos de reciclaje cuando se muestra la página
    const pointsPage = document.getElementById('points-page');
    if (pointsPage) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (pointsPage.classList.contains('active')) {
                        initializeRecyclingPoints();
                    }
                }
            });
        });
        observer.observe(pointsPage, { attributes: true });
    }
});

// Incrementar racha después de registrar una actividad
function incrementStreak(activityDate) {
    const today = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());
    const lastActivity = streakData.lastActivityDate ? new Date(streakData.lastActivityDate) : null;

    if (!lastActivity) {
        // Primera actividad
        streakData.currentStreak = 1;
        streakData.streakStartDate = today.toISOString();
    } else {
        const daysDifference = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDifference === 1) {
            // Actividad consecutiva
            streakData.currentStreak++;
        } else if (daysDifference === 0) {
            // Mismo día, no incrementar
            return;
        } else {
            // Racha rota
            if (streakData.currentStreak > streakData.bestStreak) {
                streakData.bestStreak = streakData.currentStreak;
            }
            streakData.currentStreak = 1;
            streakData.streakStartDate = today.toISOString();
        }
    }

    streakData.lastActivityDate = today.toISOString();

    // Actualizar mejor racha si es necesario
    if (streakData.currentStreak > streakData.bestStreak) {
        streakData.bestStreak = streakData.currentStreak;
    }

    // Guardar cambios
    localStorage.setItem('streakData', JSON.stringify(streakData));
}

// Sincronizar racha con servidor (preparado para futura implementación)
async function syncStreakWithServer() {
    if (!authToken || !currentUser) return;

    try {
        // TODO: Implementar cuando el backend tenga endpoints para rachas
        // const response = await fetch(`${API_BASE}/streak/sync`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${authToken}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         currentStreak: streakData.currentStreak,
        //         bestStreak: streakData.bestStreak,
        //         lastActivityDate: streakData.lastActivityDate
        //     })
        // });

        console.log('Sincronización con servidor preparada (pendiente de implementar endpoint)');
    } catch (error) {
        console.error('Error sincronizando con servidor:', error);
    }
}

// Actualizar historial de actividades
function updateActivitiesHistory() {
    const historyContainer = document.getElementById('activities-history');

    if (registeredActivities.length === 0) {
        historyContainer.innerHTML = '<p class="no-activities">No hay actividades registradas aún.</p>';
        return;
    }

    // Ordenar por fecha descendente (más recientes primero)
    const sortedActivities = registeredActivities
        .map(dateKey => new Date(dateKey))
        .sort((a, b) => b - a);

    let html = '';
    sortedActivities.slice(0, 10).forEach(date => {
        const dateKey = formatDateKey(date);
        const displayDate = formatDisplayDate(date);
        const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));

        let timeText = '';
        if (daysAgo === 0) {
            timeText = 'Hoy';
        } else if (daysAgo === 1) {
            timeText = 'Ayer';
        } else {
            timeText = `Hace ${daysAgo} días`;
        }

        html += `
            <div class="activity-item">
                <div class="activity-header">
                    <strong>♻️ Actividad de Reciclaje</strong>
                    <span>${timeText}</span>
                </div>
                <p>Registro de actividad ecológica completada</p>
                <small>${displayDate}</small>
            </div>
        `;
    });

    historyContainer.innerHTML = html;
}

// Utilidad para mostrar mensajes
function showMessage(elementId, message, type = 'error') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => element.innerHTML = '', 5000);
    }
}