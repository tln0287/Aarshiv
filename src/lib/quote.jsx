import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const QuoteContext = createContext(null)

// Lets any "Request Quote" button pre-select a product in the quote form and scroll to it.
export function QuoteProvider({ children }) {
  const [product, setProduct] = useState('')
  const requestQuote = useCallback((name = '') => {
    setProduct(name)
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  const value = useMemo(() => ({ product, setProduct, requestQuote }), [product, requestQuote])
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export const useQuote = () => useContext(QuoteContext)
