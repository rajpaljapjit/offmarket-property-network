import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
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
