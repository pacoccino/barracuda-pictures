import { Set, Router, Route } from '@redwoodjs/router'
import DashboardLayout from 'src/layouts/DashboardLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={DashboardLayout}>
        <Route path="/photos" page={PhotosPage} name="photos" />
        <Route path="/admin" page={AdminPage} name="admin" />
        <Route path="/" page={HomePage} name="home" />
        <Route notfound page={NotFoundPage} />
      </Set>
      <Route path="/photos/{id:String}" page={PhotoPage} name="photo" />
    </Router>
  )
}

export default Routes
