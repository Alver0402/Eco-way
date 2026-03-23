// API Endpoints propuestos para funcionalidades del menú principal
// Este archivo documenta las APIs que se implementarían en sprints futuros

/*
=== ENDPOINTS PROPUESTOS PARA MENÚ PRINCIPAL ===

5. SISTEMA DE RACHAS
GET /api/streak
- Headers: Authorization: Bearer <token>
- Response: {
    currentStreak: number,
    bestStreak: number,
    lastActivityDate: string | null,
    streakStartDate: string | null
  }

POST /api/streak/sync
- Headers: Authorization: Bearer <token>
- Body: {
    currentStreak: number,
    bestStreak: number,
    lastActivityDate: string | null
  }
- Response: { success: true }

POST /api/streak/reset
- Headers: Authorization: Bearer <token>
- Response: { success: true, previousStreak: number }

1. ESTADÍSTICAS DEL DASHBOARD
GET /api/dashboard/stats
- Headers: Authorization: Bearer <token>
- Response: {
    currentStreak: number,
    totalPoints: number,
    activitiesCount: number,
    co2Saved: number
  }

2. ACTIVIDADES
POST /api/activities
- Headers: Authorization: Bearer <token>
- Body: {
    type: "recycling" | "composting" | "transport" | "energy",
    description: string,
    estimatedPoints: number
  }

GET /api/activities
- Headers: Authorization: Bearer <token>
- Query: ?limit=10&offset=0
- Response: [{
    id: string,
    type: string,
    description: string,
    points: number,
    createdAt: string
  }]

3. PUNTOS DE RECICLAJE
GET /api/recycling-points
- Query: ?search=string&material=string&schedule=string&lat=number&lng=number&radius=number
- Response: [{
    id: number,
    name: string,
    address: string,
    coordinates: { lat: number, lng: number },
    phone: string,
    materials: string[],
    schedule: {
      monday: string,
      tuesday: string,
      wednesday: string,
      thursday: string,
      friday: string,
      saturday: string,
      sunday: string
    },
    specialNotes: string,
    lastUpdated: string,
    isOpen: boolean
  }]

GET /api/recycling-points/:id
- Response: Detalle completo de un punto específico

POST /api/recycling-points
- Headers: Authorization: Bearer <token> (solo admin)
- Body: Datos del nuevo punto de reciclaje

PUT /api/recycling-points/:id
- Headers: Authorization: Bearer <token> (solo admin)
- Body: Datos actualizados del punto

DELETE /api/recycling-points/:id
- Headers: Authorization: Bearer <token> (solo admin)

4. GUÍAS DE RECICLAJE
GET /api/guides
- Response: [{
    id: string,
    title: string,
    category: string,
    content: string,
    tips: string[]
  }]

5. RACHA DEL USUARIO
GET /api/user/streak
- Headers: Authorization: Bearer <token>
- Response: {
    currentStreak: number,
    longestStreak: number,
    lastActivityDate: string
  }

=== ESTRUCTURAS DE DATOS PROPUESTAS ===

User Activity:
{
  id: string,
  userId: string,
  type: "recycling" | "composting" | "transport" | "energy",
  description: string,
  points: number,
  co2Impact: number, // en kg
  createdAt: Date
}

Recycling Point:
{
  id: string,
  name: string,
  address: string,
  coordinates: {
    lat: number,
    lng: number
  },
  acceptedMaterials: string[],
  schedule: string,
  contactInfo?: string
}

Recycling Guide:
{
  id: string,
  title: string,
  category: "plastic" | "paper" | "glass" | "organic" | "electronic",
  content: string,
  tips: string[],
  difficulty: "beginner" | "intermediate" | "advanced"
}

User Stats:
{
  userId: string,
  totalPoints: number,
  totalActivities: number,
  totalCo2Saved: number,
  currentStreak: number,
  longestStreak: number,
  level: number,
  badges: string[]
}
*/