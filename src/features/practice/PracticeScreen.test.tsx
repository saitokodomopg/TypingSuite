import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PracticeScreen } from './PracticeScreen.tsx'

describe('PracticeScreen', () => {
  it('課題文が表示される', () => {
    render(<PracticeScreen />)
    expect(screen.getByText('fjfj')).toBeInTheDocument()
  })

  it('1ユニット分キー入力すると次のユニットに進む', () => {
    render(<PracticeScreen />)
    const area = screen.getByRole('application')

    fireEvent.keyDown(area, { key: 'f' })

    expect(screen.getByTestId('progress').textContent).toBe('fj')
  })

  it('ミスキーを打つとミス表示になりバッファが進まない', () => {
    render(<PracticeScreen />)
    const area = screen.getByRole('application')

    fireEvent.keyDown(area, { key: 'x' })

    expect(screen.getByRole('alert')).toHaveTextContent('ミス')
    expect(screen.getByTestId('progress').textContent).toBe('f')
  })

  it('全ユニット入力すると結果が表示される', () => {
    render(<PracticeScreen />)
    const area = screen.getByRole('application')

    for (const key of ['f', 'j', 'f', 'j']) {
      fireEvent.keyDown(area, { key })
    }

    expect(screen.getByText('結果', { selector: 'h3' })).toBeInTheDocument()
  })

  it('セレクトボックスで課題を切り替えられる', () => {
    render(<PracticeScreen />)
    const select = screen.getByRole('combobox', { name: '課題を選ぶ' })

    fireEvent.change(select, { target: { value: 'touch-type-dk' } })

    expect(screen.getByText('dkdk')).toBeInTheDocument()
  })
})
