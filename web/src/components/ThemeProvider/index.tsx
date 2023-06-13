import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { theme } from './theme'

type Props = {
    children: React.ReactNode
}

function ThemeProvider(props: Props) {
  return (
    <ChakraProvider {...props} theme={theme} resetCSS />
  )
}

export default ThemeProvider