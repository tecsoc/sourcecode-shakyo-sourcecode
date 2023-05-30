import Image from 'next/image'
import styles from './page.module.css'
import CodeMirror from '@/app/components/CodeMirrorEditor'

export default function Home() {
  return (
    <main className={styles.main}>
      <CodeMirror extensions={[]}/>
    </main>
  )
}
