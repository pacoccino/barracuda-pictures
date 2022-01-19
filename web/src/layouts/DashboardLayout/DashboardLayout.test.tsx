import { render } from '@redwoodjs/testing/web'

import DashboardLayout from './DashboardLayout'

describe('DashboardLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DashboardLayout />)
    }).not.toThrow()
  })
})
