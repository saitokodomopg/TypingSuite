import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MenuScreen } from './MenuScreen.tsx'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

function renderMenuScreen() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<MenuScreen />} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  )
}

describe('MenuScreen', () => {
  it('登録されている課題が一覧で表示される', () => {
    renderMenuScreen()

    expect(
      screen.getByRole('button', { name: 'タッチタイピング：ホームポジション(F/J)' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'ホームポジション練習（時間制）' }),
    ).toBeInTheDocument()
  })

  it('課題カードをクリックすると該当のURLへ遷移する', () => {
    renderMenuScreen()

    fireEvent.click(
      screen.getByRole('button', { name: 'タッチタイピング：ホームポジション(F/J)' }),
    )

    expect(screen.getByTestId('location').textContent).toBe('/practice/touch-type-fj')
  })
})
