import ThemeToggle from './components/ThemeToggle'

import styles from './styles.module.scss'

export const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <p>Chico.ai</p>
        <ThemeToggle />
      </header>
    </>
  )
}
