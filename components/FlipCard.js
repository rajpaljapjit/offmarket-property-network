import { motion } from 'framer-motion'
import { useState } from 'react'

export default function FlipCard({ front, back, height=320 }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      style={{perspective:1000, height, cursor:'pointer'}}
      onMouseEnter={()=>setFlipped(true)}
      onMouseLeave={()=>setFlipped(false)}
    >
      <motion.div
        animate={{rotateY: flipped ? 180 : 0}}
        transition={{duration:0.5, ease:'easeInOut'}}
        style={{
          width:'100%',
          height:'100%',
          position:'relative',
          transformStyle:'preserve-3d',
        }}
      >
        {/* Front */}
        <div style={{
          position:'absolute',
          width:'100%',
          height:'100%',
          backfaceVisibility:'hidden',
          WebkitBackfaceVisibility:'hidden',
        }}>
          {front}
        </div>
        {/* Back */}
        <div style={{
          position:'absolute',
          width:'100%',
          height:'100%',
          backfaceVisibility:'hidden',
          WebkitBackfaceVisibility:'hidden',
          transform:'rotateY(180deg)',
        }}>
          {back}
        </div>
      </motion.div>
    </div>
  )
}
