import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Patient = {
  id: string;
  name: string;
  cpf: string;
  birth_date: string;
  phone: string;
  email: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  patient_id: string | null;
  doctor_name: string;
  specialty: string;
  appointment_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
