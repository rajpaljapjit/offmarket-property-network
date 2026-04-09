import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
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
            background: '#1F2E1F',
            color: '#C9A84C',
            border: '1px solid #2D4A2D',
            fontSize: '13px',
            fontFamily: 'Arial, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#C9A84C',
              secondary: '#1F2E1F',
            },
          },
          error: {
            style: {
              background: '#2A1B1B',
              color: '#E24B4A',
              border: '1px solid #4A2D2D',
            },
            iconTheme: {
              primary: '#E24B4A',
              secondary: '#2A1B1B',
            },
          },
        }}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2E1F',
            color: '#C9A84C',
            border: '1px solid #2D4A2D',
            fontSize: '13px',
            fontFamily: 'Arial, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#C9A84C',
              secondary: '#1F2E1F',
            },
          },
          error: {
            style: {
              background: '#2A1B1B',
              color: '#E24B4A',
              border: '1px solid #4A2D2D',
            },
            iconTheme: {
              primary: '#E24B4A',
              secondary: '#2A1B1B',
            },
          },
        }}
      />
    </>
  )
}
