# EcoWay Sprint 1

API backend prototype para Sprint 1 (registro, login, panel básico y edición de perfil), siguiendo Clean Architecture y SOLID.

## 🚀 Ejecutar la aplicación completa

```bash
npm install
npm run dev
```

Abre tu navegador en: **http://localhost:4000**

## 📋 Funcionalidades implementadas

### Sprint 1 (del PDF):
- ✅ **Registro de usuario**: Formulario con validación
- ✅ **Inicio de sesión**: Autenticación con JWT
- ✅ **Panel principal**: Dashboard con información del usuario
- ✅ **Edición de perfil**: Modificar nombre de usuario
- ✅ **Menú principal**: Navegación intuitiva con todas las opciones

### Funcionalidades del menú principal:
- ✅ **Acceso a perfil de usuario**: Gestión de información personal
- ✅ **Guías de reciclaje**: Información educativa sobre reciclaje
  - ✅ **Códigos de reciclaje estándar**: Los 7 códigos con símbolos visuales, descripciones y consejos
- ✅ **Registro de actividades**: Calendario interactivo para registrar actividades diarias
  - ✅ **Calendario interactivo**: Selección visual de fechas
  - ✅ **Confirmación requerida**: Modal de confirmación antes de registrar
  - ✅ **Actualización automática de racha**: Estadísticas en tiempo real
  - ✅ **Un registro por día**: Control de duplicados
  - ✅ **No retroactivo**: Solo fechas de hoy en adelante
  - ✅ **Feedback visual**: Indicadores claros de estado
- ✅ **Puntos de reciclaje**: Localización de centros de reciclaje en Bogotá, Colombia
  - ✅ **Listado completo de puntos cercanos**: 8 centros con información detallada
  - ✅ **Nombre del punto**: Nombres descriptivos y reconocibles
  - ✅ **Dirección completa**: Ubicaciones precisas con coordenadas
  - ✅ **Tipos de materiales aceptados**: Clasificación por material con etiquetas visuales
  - ✅ **Horarios de atención**: Horarios detallados por día de la semana
  - ✅ **Información precisa y actualizada**: Datos preparados para actualizaciones regulares
  - ✅ **Búsqueda y filtros**: Por ubicación, material y horario
  - ✅ **Estadísticas en tiempo real**: Puntos abiertos, totales, etc.
- ✅ **Visualización de racha actual**: Sistema de gamificación
  - ✅ **Conteo automático de días consecutivos**: Se incrementa con cada registro
  - ✅ **Reinicio automático**: Se reinicia a cero después de 24 horas sin actividad
  - ✅ **Historial de mejor racha**: Mantiene registro de la racha más alta alcanzada
  - ✅ **Sincronización preparada**: Listo para conectar con servidor cuando esté disponible
- ✅ **Navegación intuitiva y rápida**: Interfaz responsive y moderna

### Frontend básico incluido:
- Interfaz responsive con navegación SPA
- Formularios interactivos
- Gestión de estado de autenticación
- Mensajes de feedback en tiempo real
- Diseño moderno y accesible
- Dashboard con estadísticas del usuario

## 🏗️ Arquitectura

### Backend (Clean Architecture):
- `src/domain`: entidades, interfaces de repositorio y servicios de dominio
- `src/use_cases`: casos de uso (lógica de negocio)
- `src/infrastructure`: implementaciones concretas (repositorio en memoria, servicios de hash/JWT)
- `src/interfaces/http`: controladores, rutas, middlewares

### Frontend:
- `public/index.html`: Página principal con navegación SPA
- `public/css/styles.css`: Estilos modernos y responsive
- `public/js/app.js`: Lógica JavaScript para llamadas API

## 🔐 Endpoints API

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Página principal del frontend | No |
| GET | `/api/health` | Verificación de salud | No |
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/profile` | Obtener perfil de usuario | JWT |
| PUT | `/api/profile` | Actualizar perfil | JWT |

## 🧪 Ejecutar tests

```bash
npm test
```

## 🛠️ Tecnologías utilizadas

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Autenticación**: JWT + bcrypt
- **Arquitectura**: Clean Architecture + SOLID
- **Testing**: Jest + Supertest

## 📱 Cómo usar el frontend

1. **Registro**: Completa el formulario con nombre, email y contraseña
2. **Login**: Usa tus credenciales para iniciar sesión
3. **Menú Principal**: Después del login, verás el dashboard con:
   - Tu racha actual de días consecutivos
   - Estadísticas rápidas (puntos, actividades, CO₂ ahorrado)
   - Acceso rápido a todas las funcionalidades
4. **Navegación**: Usa las tarjetas del menú para acceder a:
   - **Mi Perfil**: Gestiona tu información personal
   - **Guías de Reciclaje**: Aprende sobre reciclaje
   - **Registro de Actividades**: Registra tus acciones ecológicas
   - **Puntos de Reciclaje**: Encuentra centros cercanos
5. **Perfil**: Ve y edita tu información personal

## 🔧 Configuración

- Puerto: `4000` (configurable en `src/server.ts`)
- JWT Secret: `eco_way_secret` (configurable via `JWT_SECRET` env var)
- Base de datos: En memoria (fácil reemplazo por PostgreSQL/MySQL)

## 🚀 Próximos pasos sugeridos

1. **Base de datos**: Reemplazar `InMemoryUserRepository` por PostgreSQL con TypeORM
2. **Validación**: Añadir `class-validator` para validaciones más robustas
3. **API Backend**: Crear endpoints para actividades, puntos de reciclaje, estadísticas
4. **Sistema de Rachas**: Implementar endpoints de sincronización (`/api/streak`)
5. **Frontend avanzado**: Migrar a React/Vue para mejor UX y estado
6. **Geolocalización**: Integrar mapas para puntos de reciclaje
7. **Gamificación**: Sistema completo de rachas y recompensas
8. **Tests**: Añadir tests de integración end-to-end
9. **Documentación**: OpenAPI/Swagger para la API
10. **CI/CD**: GitHub Actions para deployment automático

## 📚 Documentación adicional

- **[api-specs.md](api-specs.md)**: Especificaciones propuestas para futuras APIs del menú principal
- **[Plan de Desarrollo de Software.pdf](Plan de Desarrollo de Software.pdf)**: Documento completo del proyecto
- **[Sprint_1.pdf](Sprint_1.pdf)**: Requisitos específicos del Sprint 1
