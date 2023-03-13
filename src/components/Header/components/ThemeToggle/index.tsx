import { ThemeContext } from '../../../../providers/theme'
import { useContext } from 'react'

import { MdLightMode, MdModeNight } from 'react-icons/md'

import styles from './styles.module.scss'

const ThemeToggle = () => {
  const { theme, updateTheme } = useContext(ThemeContext)

  return (
    <>
      <label className={styles.theme_toggle}>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={e => updateTheme && updateTheme(e.target.checked ? 'dark' : 'light')}
          />
        { theme === 'dark'
          ? <MdModeNight size={32} />
          : <MdLightMode size={32} /> }
      </label>
    </>
  )
}

export default ThemeToggle