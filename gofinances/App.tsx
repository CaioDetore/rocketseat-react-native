import React from 'react'
import AppLaoding from 'expo-app-loading'
import { ThemeProvider } from 'styled-components'

import {
  useFonts, 
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme' 
import { Register } from './src/screens/Register'
import { Dashboard } from './src/screens/Dashboard'

export default function App(){
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  if(!fontsLoaded){
    return <AppLaoding />
  }

  return (
    <ThemeProvider theme={theme}>
      <Register />
    </ThemeProvider>
  )
}