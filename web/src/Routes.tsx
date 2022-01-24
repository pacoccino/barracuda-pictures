import { Set, Router, Route } from '@redwoodjs/router'
import DashboardLayout from 'src/layouts/DashboardLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={DashboardLayout}>
        <Route path="/photos/{id:String}" page={PhotoPage} name="photo" />
        <Route path="/photos" page={PhotosPage} name="photos" />
        <Route path="/admin" page={AdminPage} name="admin" />
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
