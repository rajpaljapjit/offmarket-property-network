import { getSupabase } from '../../../lib/supabase-server'
import { sanitise } from '../sanitise'

const toInt = v => { const n = parseInt(v); return isNaN(n) ? null : n }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const adminKey = req.headers['x-admin-key']
  if (!adminKey || adminKey.trim() !== (process.env.ADMIN_SECRET_KEY || '').trim()) {
    return res.status(401).json({ error: 'Unauthorised' })
  }

  const {
    memberId, firstName, lastName, agency,
    title, description, propertyType,
    bedrooms, bathrooms, carSpaces, landSize, priceGuide,
    streetAddress, suburb, state, postcode,
    images
  } = req.body

  if (!memberId || !title || !streetAddress || !suburb || !state || !postcode) {
    return res.status(400).json({ error: 'Please fill in all required fields.' })
  }

  const supabase = getSupabase()

  const { error } = await supabase.from('listings').insert([{
    member_id: memberId,
    first_name: sanitise(firstName),
    last_name: sanitise(lastName),
    agency: sanitise(agency),
    title: sanitise(title),
    description: sanitise(description),
    property_type: sanitise(propertyType) || 'House',
    bedrooms: toInt(bedrooms),
    bathrooms: toInt(bathrooms),
    car_spaces: toInt(carSpaces),
    land_size: sanitise(landSize),
    price_guide: sanitise(priceGuide),
    street_address: sanitise(streetAddress),
    suburb: sanitise(suburb),
    state: sanitise(state),
    postcode: sanitise(postcode),
    images: images || [],
    status: 'active',
  }])

  if (error) {
    console.error('Admin listing insert error:', error)
    return res.status(500).json({ error: 'Failed to save listing.' })
  }

  return res.status(200).json({ success: true })
}
