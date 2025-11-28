import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ChemicalDetail from '../pages/ChemicalDetail.jsx'

vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) })))

describe('ChemicalDetail not-found', () => {
  it('shows not found when id missing', async () => {
    render(
      <MemoryRouter initialEntries={["/chemicals/does-not-exist"]}>
        <Routes>
          <Route path="/chemicals/:id" element={<ChemicalDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText(/Chemical not found/i)).toBeInTheDocument()
  })
})
