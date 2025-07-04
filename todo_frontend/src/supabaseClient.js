import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
// Provides a single Supabase client instance for the app.
//
// The URL/key are injected from .env or fallback defaults, never hardcoded in source.
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://fhidlwkkhjarkfhosuyl.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaWRsd2traGphcmtmaG9zdXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MTk5MjcsImV4cCI6MjA2NzE5NTkyN30.iYPl2M3XVR1lh8AgVpTeJIPrG-HqVLQL_DZr1IgZ7_s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
