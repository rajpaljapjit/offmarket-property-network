import Stripe from 'stripe'
import { getSupabase } from '../../../lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICE_IDS = {
  Silver: process.env.STRIPE_PRICE_SILVER,
  Gold: process.env.STRIPE_PRICE_GOLD,
  'Buyers Agent': process.env.STRIPE_PRICE_BUYERS_AGENT,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { memberId, plan } = req.body

  if (!memberId || !plan) return res.status(400).json({ error: 'Missing memberId or plan.' })

  const priceId = PRICE_IDS[plan]
  if (!priceId) return res.status(400).json({ error: 'Invalid plan.' })

  const supabase = getSupabase()
  const { data: member, error } = await supabase
    .from('members')
    .select('id, email, first_name, last_name, stripe_customer_id')
    .eq('id', memberId)
    .single()

  if (error || !member) return res.status(404).json({ error: 'Member not found.' })

  try {
    // Reuse existing Stripe customer or create new one
    let customerId = member.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: member.email,
        name: `${member.first_name} ${member.last_name}`,
        metadata: { memberId },
      })
      customerId = customer.id
      await supabase.from('members').update({ stripe_customer_id: customerId }).eq('id', memberId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscribed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?tab=Subscription`,
      metadata: { memberId, plan },
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: 'Failed to create checkout session.' })
  }
}
