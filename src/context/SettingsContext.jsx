import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getSettings } from '../api'
import { STORE_INFO as FALLBACK } from '../data/store'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    let active = true
    getSettings()
      .then((data) => {
        if (!active || !data || typeof data !== 'object') return
        setSettings((prev) => ({
          ...prev,
          ...data,
          locations: Array.isArray(data.locations)
            ? data.locations
            : typeof data.locations === 'string'
              ? data.locations.split('\n').filter(Boolean)
              : prev.locations,
        }))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      settings,
      setSettings,
    }),
    [settings]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
