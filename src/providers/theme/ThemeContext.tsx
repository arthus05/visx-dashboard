import { createContext, ReactNode, useEffect, useState } from "react";

type Theme = 'light' | 'dark' | undefined

interface IThemeContext {
  theme?: Theme,
  updateTheme?: (value: Theme) => void
}

interface IProps {
  children: ReactNode;
}

export const ThemeContext = createContext<IThemeContext>({})

export const ThemeProvider = ({ children }: IProps) => {
  const [theme, setTheme] = useState<Theme>(undefined)

  useEffect(() => {
    const root = window.document.documentElement;

    const initialColorValue = root.style.getPropertyValue('--initial-color-theme') as Theme

    setTheme(initialColorValue)
  }, [])

  const updateTheme = (value: Theme) => {
    const root = window.document.documentElement

    setTheme(value)

    value && localStorage.setItem('color-theme', value)

    root.style.setProperty(
      '--foreground-color',
      value === 'light' ? '#0A0A0B' : '#F9F9F9'
    )

    root.style.setProperty(
      '--background-color',
      value === 'light' ? '#F9F9F9' : '#0A0A0B'
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
