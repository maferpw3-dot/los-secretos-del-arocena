# Los Secretos del Arocena 🏛️🔍

Landing page interactiva para el primer Escape Room en vivo dentro del **Museo Arocena** en Torreón, Coahuila, México.

## 🚀 Características
- **Arquitectura de 7 secciones** basada en el PRD oficial.
- **Selector Dual Día / Noche** inspirado en la interfaz moderna y editorial de Bershka.
- **Calculadora Dinámica de Precios:** Calcula al instante la tarifa para equipos de 4 a 6 personas ($80 MXN diurno / $100 MXN nocturno).
- **Prueba Social y Reseñas:** Estructura de testimonios y badges de escape basada en los benchmarks de Virtual Escaping.
- **Flujo de Reserva Directa:** Envío automático del apartado vía WhatsApp API oficial.
- **Base de Datos Supabase:** Tabla `reservas` conectada para auditoría y registro de leads.
- **Modal "Invita a tu equipo":** Generador de mensaje prellenado para WhatsApp y copia al portapapeles.

## 🛠️ Tecnologías
- HTML5 Semántico
- Tailwind CSS (CDN)
- Vanilla JavaScript Moderno
- Supabase JS Client v2
- Phosphor Icons

## 🗄️ Base de Datos (Supabase)
Ejecuta el script `supabase_schema.sql` en tu proyecto de Supabase para crear la tabla de `reservas` con sus políticas de seguridad (RLS).

## 🌐 Despliegue en Vercel
Compatible con despliegue estático con configuración optimizada en `vercel.json`.
