import { motion } from 'framer-motion'

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
  }
}

export function SkeletonBox({ width='100%', height=20, borderRadius=2 }) {
  return (
    <motion.div
      animate={shimmer.animate}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #1F2E1F 25%, #2D4A2D 50%, #1F2E1F 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div style={{background:'#162016',border:'1px solid #2D4A2D',padding:20,display:'flex',flexDirection:'column',gap:12}}>
      <SkeletonBox height={180}/>
      <SkeletonBox height={16} width="60%"/>
      <SkeletonBox height={12} width="40%"/>
      <SkeletonBox height={12} width="80%"/>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div style={{background:'#162016',border:'1px solid #2D4A2D',padding:16,display:'flex',gap:16,alignItems:'center'}}>
      <SkeletonBox width={60} height={60}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
        <SkeletonBox height={14} width="40%"/>
        <SkeletonBox height={12} width="60%"/>
        <SkeletonBox height={12} width="30%"/>
      </div>
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:32}}>
      {[1,2,3,4].map(i=>(
        <div key={i} style={{background:'#1F2E1F',border:'1px solid #2D4A2D',padding:24,display:'flex',flexDirection:'column',gap:12}}>
          <SkeletonBox height={10} width="60%"/>
          <SkeletonBox height={36} width="40%"/>
        </div>
      ))}
    </div>
  )
}
