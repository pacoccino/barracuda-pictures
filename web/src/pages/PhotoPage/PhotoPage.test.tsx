import { render } from '@redwoodjs/testing/web'

import PhotoPage from './PhotoPage'

describe('PhotoPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PhotoPage />)
    }).not.toThrow()
  })
})
