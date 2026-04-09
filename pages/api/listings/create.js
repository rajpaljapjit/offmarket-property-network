export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co'
  const key = process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'

  const { memberId, firstName, lastName, agency, title, description, propertyType, bedrooms, bathrooms, carSpaces, landSize, priceGuide, streetAddress, suburb, state, postcode, images } = req.body

  if (!title || !streetAddress || !suburb || !state) {
    return res.status(400).json({ error: 'Please fill in all required fields.' })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key)

    const { error: dbError } = await supabase
      .from('listings')
      .insert([{
        member_id: memberId,
        first_name: firstName,
        last_name: lastName,
        agency,
        title,
        description,
        property_type: propertyType,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        car_spaces: parseInt(carSpaces) || 0,
        land_size: landSize,
        price_guide: priceGuide,
        street_address: streetAddress,
        suburb,
        state,
        postcode,
        images: images || [],
        status: 'active',
      }])

    if (dbError) {
      return res.status(500).json({ error: `DB error: ${dbError.message}` })
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    return res.status(500).json({ error: `Unexpected error: ${err.message}` })
  }
}
