// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'
import ImagesLayout from 'src/layouts/Scaffold/ImagesLayout/ImagesLayout'
import DashboardLayout from 'src/layouts/DashboardLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ImagesLayout}>
        <Route path="/scaffold/images/new" page={ScaffoldImageNewImagePage} name="newImage" />
        <Route path="/scaffold/images/{id:Int}/edit" page={ScaffoldImageEditImagePage} name="editImage" />
        <Route path="/scaffold/images/{id:Int}" page={ScaffoldImageImagePage} name="image" />
        <Route path="/scaffold/images" page={ScaffoldImageImagesPage} name="images" />
      </Set>
      <Set wrap={DashboardLayout}>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
