import React from 'react'

const MagicScriptTag = () => {
  const codeToRunOnClient = `
    (function() {
      function getInitialColorTheme() {
        const persistedColorPreference = window.localStorage.getItem('color-theme')
        const hasPersistedPreference = typeof persistedColorPreference === 'string'

        if (hasPersistedPreference) {
          return persistedColorPreference
        }

        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const hasMediaQueryPreference = typeof mql.matches === 'boolean';

        if (hasMediaQueryPreference) {
          return mql.matches ? 'dark' : 'light'
        }

        return 'light'
      }

      const colorTheme = getInitialColorTheme()

      const root = document.documentElement

      root.style.setProperty(
        '--foreground-color',
        colorTheme === 'light'
          ? '#F9F9F9'
          : '#0A0A0B'
      )

      root.style.setProperty(
        '--background-color',
        colorTheme === 'light'
          ? '#0A0A0B'
          : '#F9F9F9'
      )

      root.style.setProperty('--initial-color-theme', colorTheme)
    })()`

  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

export default MagicScriptTag