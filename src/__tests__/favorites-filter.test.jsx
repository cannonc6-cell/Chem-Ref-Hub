import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Chemicals from '../pages/Chemicals.jsx'

vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([
  { id: 'a', 'Chemical Name': 'Water', Formula: 'H2O', tags: ['solvent'] },
  { id: 'b', 'Chemical Name': 'Ethanol', Formula: 'C2H6O', tags: ['solvent'] },
]) })))

// ensure clean state
beforeEach(() => {
  localStorage.clear()
})

describe('Favorites filter', () => {
  it('shows only favorites when toggled', async () => {
    // seed favorites: mark 'b' as favorite
    localStorage.setItem('favoriteChemicals', JSON.stringify(['b']))

    render(
      <MemoryRouter>
        <Chemicals />
      </MemoryRouter>
    )

    // Wait for items
    expect(await screen.findByText('Water')).toBeInTheDocument()
    expect(screen.getByText('Ethanol')).toBeInTheDocument()

    // Toggle favorites only
    const toggle = screen.getByLabelText(/favorites only/i)
    fireEvent.click(toggle)

    // Now only Ethanol should be visible
    expect(screen.queryByText('Water')).not.toBeInTheDocument()
    expect(screen.getByText('Ethanol')).toBeInTheDocument()
  })
})
