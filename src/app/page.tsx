import styles from './page.module.sass';
import CodeMirror from '@/app/components/CodeMirrorEditor';

export default function Home() {
  return (
    <main className={styles.main}>
      <CodeMirror extensions={[]} />
    </main>
  );
}
