import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Chemicals from '../pages/Chemicals.jsx'

vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) })))

describe('Chemicals page', () => {
  it('renders and shows empty state when no chemicals', async () => {
    render(
      <MemoryRouter>
        <Chemicals />
      </MemoryRouter>
    )
    expect(await screen.findByText(/No chemicals found/i)).toBeInTheDocument()
  })
})
