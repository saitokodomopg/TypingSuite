import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  console.error(
    'VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY が .env に設定されていません。',
  )
  process.exit(1)
}

const supabase = createClient(url, key)
const { error } = await supabase.auth.getSession()

if (error) {
  console.error('Supabase への接続に失敗しました:', error.message)
  process.exit(1)
}

console.log('Supabase への接続を確認しました。')
