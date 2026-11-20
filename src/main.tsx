import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { Layout } from './componentes/Layout.tsx'
import { RotaPrivada } from './componentes/RotaPrivada.tsx'
import { AuthProvider } from './contexts/AuthProvider.tsx'
import { CadastroPage } from './pages/CadastroPage.tsx'
import { InicioPage } from './pages/InicioPage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { NotFoundPage } from './pages/NotFound.tsx'
import { PerfilPage } from './pages/PerfilPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/cadastro' element={<CadastroPage />} />

          <Route element={<RotaPrivada />}>
            <Route element={<Layout />}>
              <Route path='/' element={<InicioPage />} />
              <Route path='/perfil' element={<PerfilPage />} />
            </Route>
          </Route>

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
