import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollProgress from '../components/ScrollProgress'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
      <ScrollProgress/>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.pathname}
          initial={{opacity:0, y:8}}
          animate={{opacity:1, y:0}}
          exit={{opacity:0, y:-8}}
          transition={{duration:0.25, ease:'easeInOut'}}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0E1117',
            color: '#C9A96E',
            border: '1px solid rgba(201,169,110,0.2)',
            fontSize: '13px',
            fontFamily: "'Inter', -apple-system, sans-serif",
            borderRadius: '6px',
          },
          success: {
            iconTheme: {
              primary: '#C9A96E',
              secondary: '#0E1117',
            },
          },
          error: {
            style: {
              background: '#160F0F',
              color: '#E24B4A',
              border: '1px solid rgba(226,75,74,0.25)',
              borderRadius: '6px',
            },
            iconTheme: {
              primary: '#E24B4A',
              secondary: '#160F0F',
            },
          },
        }}
      />
    </>
  )
}
