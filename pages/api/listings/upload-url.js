import { getSupabase } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { fileName } = req.body
  if (!fileName) return res.status(400).json({ error: 'fileName required' })

  const supabase = getSupabase()
  const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-_]/g, '-')}`

  const { data, error } = await supabase.storage
    .from('listing-images')
    .createSignedUploadUrl(safeName)

  if (error) return res.status(500).json({ error: 'Failed to create upload URL' })

  const publicUrl = `https://jmjtcmfjknmdnlgxudfk.supabase.co/storage/v1/object/public/listing-images/${safeName}`
  return res.status(200).json({ signedUrl: data.signedUrl, token: data.token, path: safeName, publicUrl })
}
