import { render } from '@redwoodjs/testing/web'

import HomePage from './PhotosPage'

describe('HomePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HomePage />)
    }).not.toThrow()
  })
})
