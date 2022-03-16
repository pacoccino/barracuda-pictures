import { Set, Router, Private, Route, navigate, routes } from '@redwoodjs/router'
import DashboardLayout from 'src/layouts/DashboardLayout'
import { useEffect } from 'react'

import { FilterContextProvider } from 'src/contexts/filter'
import { TagContextProvider } from 'src/contexts/tags'
import { SelectContextProvider } from 'src/contexts/select'
import { ApluContextProvider } from 'src/contexts/aplu'
import PhotosPage from 'src/pages/PhotosPage/PhotosPage'

const contexts = [FilterContextProvider, TagContextProvider, SelectContextProvider, ApluContextProvider]

const Routes = () => {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.constructor === HTMLInputElement) return
      switch (e.code) {
        case 'KeyG':
          navigate(routes.photos())
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <Router>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />

      <Private unauthenticated="login" wrap={contexts}>
        <Set wrap={[DashboardLayout]}>
          <Route path="/photos/{photoId:String}" page={PhotosPage} name="photo" />
          <Route path="/photos" page={PhotosPage} name="photos" />
          <Route path="/admin" page={AdminPage} name="admin" />
          <Route path="/infos" page={InfoPage} name="infos" />
        </Set>
        <Route path="/" page={RedirectPage} name="home" />
      </Private>

      <Route path="/" page={NotFoundPage} name="index" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
