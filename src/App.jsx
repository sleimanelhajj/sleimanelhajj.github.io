import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import BootScreen from './components/BootScreen'
import Desktop from './os/Desktop'
import MobileHome from './os/MobileHome'
import { Wallpaper } from './os/Chrome'
import { useMedia } from './os/hooks'

const seenBoot = () => {
  try { return sessionStorage.getItem('booted') === '1' } catch { return false }
}

export default function App() {
  const mobile = useMedia('(max-width: 767px)')
  const [booting, setBooting] = useState(() => !seenBoot())
  const done = useCallback(() => {
    try { sessionStorage.setItem('booted', '1') } catch { /* ignore */ }
    setBooting(false)
  }, [])

  return (
    <>
      <Wallpaper />
      <AnimatePresence>{booting && <BootScreen key="boot" onDone={done} />}</AnimatePresence>
      {!booting && (mobile ? <MobileHome /> : <Desktop />)}
    </>
  )
}
