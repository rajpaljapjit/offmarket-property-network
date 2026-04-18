import Stripe from 'stripe'
import { getSupabase } from '../../../lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { memberId } = req.body
  if (!memberId) return res.status(400).json({ error: 'Missing memberId.' })

  const supabase = getSupabase()
  const { data: member } = await supabase
    .from('members')
    .select('stripe_customer_id')
    .eq('id', memberId)
    .single()

  if (!member?.stripe_customer_id) {
    return res.status(400).json({ error: 'No Stripe customer found.' })
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    })
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Portal error:', err)
    return res.status(500).json({ error: 'Failed to open billing portal.' })
  }
}
