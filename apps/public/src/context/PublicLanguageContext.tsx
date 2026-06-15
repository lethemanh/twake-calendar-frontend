import { createContext, useContext } from 'react'
import { AVAILABLE_LANGUAGES } from '@common/features/Settings/constants'

export const SUPPORTED_LANGUAGES = AVAILABLE_LANGUAGES.map(lang => lang.code)
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const isValidLanguage = (
  lang: string | null | undefined
): lang is SupportedLanguage => {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
}

export const getBrowserLanguage = (): string | undefined => {
  if (typeof navigator === 'undefined') {
    return undefined
  }
  const navLang =
    navigator.language || (navigator.languages && navigator.languages[0])
  if (!navLang) {
    return undefined
  }
  return navLang.split('-')[0].toLowerCase()
}

const safeLocalStorageGet = (key: string): string | undefined => {
  try {
    return window.localStorage.getItem(key) ?? undefined
  } catch {
    return undefined
  }
}

export const getDefaultLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return 'en'
  }
  const savedLang = safeLocalStorageGet('lang')
  const defaultLang = window.LANG
  const browserLang = getBrowserLanguage()

  return (
    [savedLang, browserLang, defaultLang].find(
      l => !!l && isValidLanguage(l)
    ) || 'en'
  )
}

export interface PublicLanguageContextType {
  currentLanguage: SupportedLanguage
  setCurrentLanguage: (lang: SupportedLanguage) => void
}

export const PublicLanguageContext = createContext<PublicLanguageContextType>({
  currentLanguage: 'en',
  setCurrentLanguage: () => {}
})

export const usePublicLanguage = (): PublicLanguageContextType =>
  useContext(PublicLanguageContext)
