import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PracticeScreen } from './PracticeScreen.tsx'

describe('PracticeScreen', () => {
  it('課題文が表示される', () => {
    render(<PracticeScreen />)
    expect(screen.getByText('fjfj')).toBeInTheDocument()
  })

  it('1ユニット分キー入力すると入力済み・次の1文字が入れ替わる', () => {
    render(<PracticeScreen />)
    const area = screen.getByRole('application')

    expect(screen.getByTestId('typed-text').textContent).toBe('')
    expect(screen.getByTestId('current-text').textContent).toBe('f')

    fireEvent.keyDown(area, { key: 'f' })

    expect(screen.getByTestId('typed-text').textContent).toBe('f')
    expect(screen.getByTestId('current-text').textContent).toBe('j')
  })

  it('ミスキーを打つとミス表示になり進捗が変わらない', () => {
    render(<PracticeScreen />)
    const area = screen.getByRole('application')

    fireEvent.keyDown(area, { key: 'x' })

    expect(screen.getByRole('alert')).toHaveTextContent('ミス')
    expect(screen.getByTestId('typed-text').textContent).toBe('')
    expect(screen.getByTestId('current-text').textContent).toBe('f')
  })

  it('全ユニット入力すると結果が表示される', () => {
    render(<PracticeScreen />)
    const area = screen.getByRole('application')

    for (const key of ['f', 'j', 'f', 'j']) {
      fireEvent.keyDown(area, { key })
    }

    expect(screen.getByText('結果', { selector: 'h3' })).toBeInTheDocument()
  })

  it('ボタンで課題を切り替えられる', () => {
    render(<PracticeScreen />)
    const button = screen.getByRole('button', {
      name: 'タッチタイピング：ホームポジション(D/K)（確認用）',
    })

    fireEvent.click(button)

    expect(screen.getByText('dkdk')).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('リトライボタンを押すと同じ課題のまま進捗がリセットされる', () => {
    render(<PracticeScreen />)
    const area = screen.getByRole('application')

    fireEvent.keyDown(area, { key: 'f' })
    expect(screen.getByTestId('typed-text').textContent).toBe('f')

    fireEvent.click(screen.getByRole('button', { name: 'リトライ' }))

    expect(screen.getByText('fjfj')).toBeInTheDocument()
    expect(screen.getByTestId('typed-text').textContent).toBe('')
    expect(screen.getByTestId('current-text').textContent).toBe('f')
  })

  it('結果表示中でもリトライボタンで同じ課題をやり直せる', () => {
    render(<PracticeScreen />)
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
