import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { useAtomValue } from 'jotai'
import { authAtom } from './atoms/auth'
import { Router, useLocation } from 'preact-iso'
import Login from './pages/Login'
import Layout from './components/Layout'

export function App() {
  const auth = useAtomValue(authAtom) 
  return (
    <>
      {auth ? <Layout /> : <Login />}
    </>
  )
}
