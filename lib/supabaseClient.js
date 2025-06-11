import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zwenbysigzwuookcejqt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3ZW5ieXNpZ3p3dW9va2NlanF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MjQ5NDEsImV4cCI6MjA2NTIwMDk0MX0.p8JdhXHKjbhyNSMAfFCAme7om5ERAubsmHzC9RKqxf4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)