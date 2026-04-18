import Stripe from 'stripe'
import { getSupabase } from '../../../lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  const supabase = getSupabase()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { memberId, plan } = session.metadata || {}
    if (memberId && plan) {
      await supabase.from('members').update({
        plan,
        subscription_status: 'active',
        stripe_subscription_id: session.subscription,
      }).eq('id', memberId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object
    const customerId = sub.customer
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    if (member) {
      await supabase.from('members').update({ subscription_status: 'cancelled' }).eq('id', member.id)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object
    const customerId = sub.customer
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    if (member) {
      await supabase.from('members').update({
        subscription_status: sub.status,
      }).eq('id', member.id)
    }
  }

  if (event.type === 'customer.subscription.trial_will_end') {
    const sub = event.data.object
    const customerId = sub.customer
    const { data: member } = await supabase
      .from('members')
      .select('id, email, first_name')
      .eq('stripe_customer_id', customerId)
      .single()
    if (member) {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Off Market Hub <notifications@offmarkethub.com.au>',
              to: [member.email],
              subject: 'Your free trial ends in 3 days',
              html: `
                <html><body style="background:#1B2A1B;font-family:Arial,sans-serif;">
                  <div style="max-width:600px;margin:0 auto;background:#162016;padding:40px;">
                    <h1 style="color:#C9A84C;font-size:22px;margin:0 0 16px;">Your trial ends in 3 days, ${member.first_name}</h1>
                    <p style="color:#E8E8E8;line-height:1.7;margin:0 0 24px;">Your 3-month free trial of Off Market Hub is ending soon. Add your payment details to keep full access to the platform.</p>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">Add payment details →</a>
                  </div>
                </body></html>
              `
            })
          })
        } catch (e) { console.error('Trial ending email error:', e) }
      }
    }
  }

  return res.status(200).json({ received: true })
}
