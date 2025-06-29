import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

export const supabase = createClient('https://gqijpcpgzetuxommgkcv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWpwY3BnemV0dXhvbW1na2N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA2NDM0MDMsImV4cCI6MjAzNjIxOTQwM30.P7NCDzoE8ZpUr3TPEVufoUdhW1bmRyuRW33QxkRGpFo', {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})