import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { PracticeScreen } from './PracticeScreen.tsx'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

function renderPracticeScreen(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/practice/:taskId" element={<PracticeScreen />} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  )
}

describe('PracticeScreen', () => {
  it('課題文が表示される', () => {
    renderPracticeScreen('/practice/touch-type-fj')
    expect(screen.getByText('fjfj')).toBeInTheDocument()
  })

  it('存在しないtaskIdの場合は課題が見つかりませんと表示される', () => {
    renderPracticeScreen('/practice/does-not-exist')
    expect(screen.getByText('課題が見つかりません')).toBeInTheDocument()
  })

  it('1ユニット分キー入力すると入力済み・次の1文字が入れ替わる', () => {
    renderPracticeScreen('/practice/touch-type-fj')
    const area = screen.getByRole('application')

    expect(screen.getByTestId('typed-text').textContent).toBe('')
    expect(screen.getByTestId('current-text').textContent).toBe('f')

    fireEvent.keyDown(area, { key: 'f' })

    expect(screen.getByTestId('typed-text').textContent).toBe('f')
    expect(screen.getByTestId('current-text').textContent).toBe('j')
  })

  it('ミスキーを打つとミス表示になり進捗が変わらない', () => {
    renderPracticeScreen('/practice/touch-type-fj')
    const area = screen.getByRole('application')

    fireEvent.keyDown(area, { key: 'x' })

    expect(screen.getByRole('alert')).toHaveTextContent('ミス')
    expect(screen.getByTestId('typed-text').textContent).toBe('')
    expect(screen.getByTestId('current-text').textContent).toBe('f')
  })

  it('全ユニット入力すると結果が表示される', () => {
    renderPracticeScreen('/practice/touch-type-fj')
    const area = screen.getByRole('application')

    for (const key of ['f', 'j', 'f', 'j']) {
      fireEvent.keyDown(area, { key })
    }

    expect(screen.getByText('結果', { selector: 'h3' })).toBeInTheDocument()
  })

  it('課題切り替えボタンでURLが遷移し対象課題が開く', () => {
    renderPracticeScreen('/practice/touch-type-fj')
    const button = screen.getByRole('button', {
      name: 'ホームポジション基礎（A S D F / J K L ;）',
    })

    fireEvent.click(button)

    expect(screen.getByTestId('location').textContent).toBe('/practice/home-position-basic')
    expect(
      screen.getByRole('heading', { name: 'ホームポジション基礎（A S D F / J K L ;）' }),
    ).toBeInTheDocument()
  })

  it('リトライボタンを押すと同じ課題のまま進捗がリセットされる', () => {
    renderPracticeScreen('/practice/touch-type-fj')
    const area = screen.getByRole('application')

    fireEvent.keyDown(area, { key: 'f' })
    expect(screen.getByTestId('typed-text').textContent).toBe('f')

    fireEvent.click(screen.getByRole('button', { name: 'リトライ' }))

    expect(screen.getByText('fjfj')).toBeInTheDocument()
    expect(screen.getByTestId('typed-text').textContent).toBe('')
    expect(screen.getByTestId('current-text').textContent).toBe('f')
  })

  it('結果表示中でもリトライボタンで同じ課題をやり直せる', () => {
    renderPracticeScreen('/practice/touch-type-fj')
    const area = screen.getByRole('application')

    for (const key of ['f', 'j', 'f', 'j']) {
      fireEvent.keyDown(area, { key })
    }
    expect(screen.getByText('結果', { selector: 'h3' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'リトライ' }))

    expect(screen.queryByText('結果', { selector: 'h3' })).not.toBeInTheDocument()
    expect(screen.getByTestId('current-text').textContent).toBe('f')
  })
})
