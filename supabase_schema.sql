-- Esquema de base de datos para "Los Secretos del Arocena" en Supabase

CREATE TABLE IF NOT EXISTS public.reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capitan TEXT NOT NULL,
    telefono TEXT NOT NULL,
    fecha DATE NOT NULL,
    horario TEXT NOT NULL,
    modalidad TEXT NOT NULL CHECK (modalidad IN ('diurno', 'nocturno')),
    jugadores INTEGER NOT NULL CHECK (jugadores BETWEEN 4 AND 6),
    total NUMERIC(10, 2) NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente_taquilla',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Política para permitir que los visitantes de la landing page inserten reservas
CREATE POLICY "Permitir inserción pública de reservas" 
ON public.reservas 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Política para permitir que solo usuarios autenticados (administración del museo) lean las reservas
CREATE POLICY "Permitir lectura a administradores" 
ON public.reservas 
FOR SELECT 
TO authenticated 
USING (true);
