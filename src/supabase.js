import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bngjslzcghmiluccqjhw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZ2pzbHpjZ2htaWx1Y2Nxamh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTU0ODUsImV4cCI6MjA5MzQ3MTQ4NX0.1jS93W8I46QPu0V0hIhphB3dXsRJyCUVvTK-wBlhy_g'

export const supabase = createClient(supabaseUrl, supabaseKey)