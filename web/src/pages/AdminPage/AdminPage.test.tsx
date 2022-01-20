import { render } from '@redwoodjs/testing/web'

import AdminPage from './AdminPage'

describe('AdminPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminPage />)
    }).not.toThrow()
  })
})
