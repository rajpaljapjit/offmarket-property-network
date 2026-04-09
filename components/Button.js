import { motion } from 'framer-motion'

export function GoldButton({ children, onClick, type='button', disabled=false, fullWidth=false, size='md' }) {
  const padding = size==='sm' ? '8px 16px' : size==='lg' ? '16px 40px' : '12px 28px'
  const fontSize = size==='sm' ? 12 : size==='lg' ? 15 : 13

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : {scale:1.02, boxShadow:'0 0 20px rgba(201,168,76,0.3)'}}
      whileTap={disabled ? {} : {scale:0.98}}
      style={{
        background: disabled ? '#5a4a1f' : 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
        backgroundSize: '200% 200%',
        border: 'none',
        color: '#000',
        fontSize,
        fontWeight: 700,
        padding,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </motion.button>
  )
}

export function SilverButton({ children, onClick, type='button', disabled=false, fullWidth=false, size='md' }) {
  const padding = size==='sm' ? '8px 16px' : size==='lg' ? '16px 40px' : '12px 28px'
  const fontSize = size==='sm' ? 12 : size==='lg' ? 15 : 13

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : {scale:1.02, boxShadow:'0 0 20px rgba(168,180,204,0.2)'}}
      whileTap={disabled ? {} : {scale:0.98}}
      style={{
        background: 'none',
        border: '1px solid #A8B4CC',
        color: '#A8B4CC',
        fontSize,
        fontWeight: 600,
        padding,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </motion.button>
  )
}

export function DangerButton({ children, onClick, type='button', disabled=false, size='md' }) {
  const padding = size==='sm' ? '8px 16px' : size==='lg' ? '16px 40px' : '12px 28px'
  const fontSize = size==='sm' ? 12 : size==='lg' ? 15 : 13

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : {scale:1.02, boxShadow:'0 0 20px rgba(226,75,74,0.2)'}}
      whileTap={disabled ? {} : {scale:0.98}}
      style={{
        background: 'none',
        border: '1px solid #E24B4A',
        color: '#E24B4A',
        fontSize,
        fontWeight: 600,
        padding,
        cursor: disabled ? 'not-allowed' : 'pointer',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </motion.button>
  )
}

export function GreenButton({ children, onClick, type='button', disabled=false, size='md' }) {
  const padding = size==='sm' ? '8px 16px' : size==='lg' ? '16px 40px' : '12px 28px'
  const fontSize = size==='sm' ? 12 : size==='lg' ? 15 : 13

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : {scale:1.02, boxShadow:'0 0 20px rgba(76,175,80,0.2)'}}
      whileTap={disabled ? {} : {scale:0.98}}
      style={{
        background: 'linear-gradient(135deg, #2ECC71 0%, #4CAF50 100%)',
        border: 'none',
        color: '#000',
        fontSize,
        fontWeight: 700,
        padding,
        cursor: disabled ? 'not-allowed' : 'pointer',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </motion.button>
  )
}
