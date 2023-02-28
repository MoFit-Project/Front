import '../styles/globals.css'
import { RecoilRoot } from 'recoil';
import { motion } from 'framer-motion'

export default function App({ Component, pageProps, router }) {
  return (
    <motion.div key={router.route} initial="pageInitial" animate="pageAnimate" variants={{
      pageInitial: {
        opacity: 0
      },
      pageAnimate: {
        opacity: 1
      },
    }}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </motion.div>
  )
}
