import { Set, Router, Route } from '@redwoodjs/router'
import DashboardLayout from 'src/layouts/DashboardLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={DashboardLayout}>
        <Route path="/photos" page={PhotosPage} name="photos" />
        <Route path="/admin" page={AdminPage} name="admin" />
      </Set>
      <Route path="/photos/{id:String}" page={PhotoPage} name="photo" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
