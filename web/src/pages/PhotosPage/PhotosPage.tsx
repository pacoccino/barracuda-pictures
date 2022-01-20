import { MetaTags } from '@redwoodjs/web'
import ImagesCell from 'src/components/Image/ImagesCell'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>Photos</h1>

      <ImagesCell />
    </>
  )
}

export default HomePage
