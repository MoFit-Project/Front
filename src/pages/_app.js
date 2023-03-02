import '../styles/globals.css'
import { RecoilRoot } from 'recoil';
import { motion } from 'framer-motion'

export default function App({ Component, pageProps, router }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>

  )
}
