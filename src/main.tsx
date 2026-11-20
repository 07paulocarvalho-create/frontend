import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { Layout } from './componentes/Layout.tsx'
import { RotaAdmin } from './componentes/RotaAdmin.tsx'
import { RotaPrivada } from './componentes/RotaPrivada.tsx'
import { AuthProvider } from './contexts/AuthProvider.tsx'
import { AutoresPage } from './pages/AutoresPage.tsx'
import { AutorFormPage } from './pages/AutorFormPage.tsx'
import { CadastroPage } from './pages/CadastroPage.tsx'
import { CategoriaFormPage } from './pages/CategoriaFormPage.tsx'
import { CategoriasPage } from './pages/CategoriasPage.tsx'
import { InicioPage } from './pages/InicioPage.tsx'
import { LivroFormPage } from './pages/LivroFormPage.tsx'
import { LivrosPage } from './pages/LivrosPage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { NotFoundPage } from './pages/NotFound.tsx'
import { PedidoDetalhePage } from './pages/PedidoDetalhePage.tsx'
import { PedidoFormPage } from './pages/PedidoFormPage.tsx'
import { PedidosPage } from './pages/PedidosPage.tsx'
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
              <Route path='/livros' element={<LivrosPage />} />
              <Route path='/pedidos' element={<PedidosPage />} />
              <Route path='/pedidos/novo' element={<PedidoFormPage />} />
              <Route path='/pedidos/:id' element={<PedidoDetalhePage />} />

              <Route element={<RotaAdmin />}>
                <Route path='/livros/novo' element={<LivroFormPage />} />
                <Route path='/livros/:id/editar' element={<LivroFormPage />} />
                <Route path='/autores' element={<AutoresPage />} />
                <Route path='/autores/novo' element={<AutorFormPage />} />
                <Route path='/autores/:id/editar' element={<AutorFormPage />} />
                <Route path='/categorias' element={<CategoriasPage />} />
                <Route path='/categorias/nova' element={<CategoriaFormPage />} />
                <Route path='/categorias/:id/editar' element={<CategoriaFormPage />} />
              </Route>
            </Route>
          </Route>

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
