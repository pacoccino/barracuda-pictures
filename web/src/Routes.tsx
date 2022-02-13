import { Set, Router, Route, navigate, routes } from '@redwoodjs/router'
import DashboardLayout from 'src/layouts/DashboardLayout'
import { useEffect } from 'react'

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
      <Set wrap={DashboardLayout}>
        <Route path="/photos" page={PhotosPage} name="photos" />
        <Route path="/admin" page={AdminPage} name="admin" />
        <Route path="/infos" page={InfoPage} name="infos" />
      </Set>
      <Route path="/photos/{id:String}" page={PhotoPage} name="photo" />
      <Route path="/" page={NotFoundPage} name="index" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
