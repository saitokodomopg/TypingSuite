import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App.tsx'

describe('App', () => {
  it('renders the title', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { name: 'TypingSuite' }),
    ).toBeInTheDocument()
  })
})
