import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
      name: 'ホームポジション練習（時間制）',
    })

    fireEvent.click(button)

    expect(screen.getByTestId('location').textContent).toBe('/practice/home-position-basic')
    expect(
      screen.getByRole('heading', { name: 'ホームポジション練習（時間制）' }),
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

describe('PracticeScreen（1問で終わる課題）', () => {
  it('スペースを押してもページがスクロールしない', () => {
    renderPracticeScreen('/practice/touch-type-fj')
    const area = screen.getByRole('application')

    expect(fireEvent.keyDown(area, { key: ' ' })).toBe(false)
  })

  it('次に打つキーと、どの手・どの指で打つかが表示される', () => {
    renderPracticeScreen('/practice/touch-type-fj')

    expect(screen.getByTestId('finger-label')).toHaveTextContent('F：左手・人さし指')
    fireEvent.keyDown(screen.getByRole('application'), { key: 'f' })
    expect(screen.getByTestId('finger-label')).toHaveTextContent('J：右手・人さし指')
  })
})

describe('PracticeScreen（時間制の課題）', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  // 今の行の残りを全部打つ
  function typeCurrentLine() {
    const area = screen.getByRole('application')
    const text = screen.getByTestId('progress').textContent!.replaceAll('␣', ' ')
    const typed = screen.getByTestId('typed-text').textContent!
    for (const key of text.slice(typed.length)) {
      fireEvent.keyDown(area, { key })
    }
  }

  const currentLineText = () => screen.getByTestId('progress').textContent!

  it('1分 / 3分 / 5分 / 10分 から時間を選べる', () => {
    renderPracticeScreen('/practice/home-position-basic')

    for (const label of ['1分', '3分', '5分', '10分']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: '1分' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('remaining')).toHaveTextContent('01:00')

    fireEvent.click(screen.getByRole('button', { name: '3分' }))

    expect(screen.getByRole('button', { name: '3分' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('remaining')).toHaveTextContent('03:00')
  })

  it('最初のキーを押すとカウントダウンが始まり、練習中は時間を選べない', () => {
    vi.useFakeTimers()
    renderPracticeScreen('/practice/home-position-basic')

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('remaining')).toHaveTextContent('01:00')

    fireEvent.keyDown(screen.getByRole('application'), { key: 'x' })
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('remaining')).toHaveTextContent('00:59')
    expect(screen.getByRole('button', { name: '3分' })).toBeDisabled()
  })

  it('0秒になると入力が止まり、行数と段階を含む結果が出る', () => {
    vi.useFakeTimers()
    renderPracticeScreen('/practice/home-position-basic')
    const area = screen.getByRole('application')

    typeCurrentLine()
    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(screen.getByTestId('remaining')).toHaveTextContent('00:00')
    expect(screen.getByText('結果', { selector: 'h3' })).toBeInTheDocument()
    expect(screen.getByText(/速度:/)).toBeInTheDocument()
    expect(screen.getByText(/正確さ:/)).toBeInTheDocument()
    expect(screen.getByText('打ち終えた行数: 1行')).toBeInTheDocument()
    expect(screen.getByText('たどり着いた段階: 段階 1 / 11')).toBeInTheDocument()

    const before = currentLineText()
    const typedBefore = screen.getByTestId('typed-text').textContent
    fireEvent.keyDown(area, { key: before[0] })
    expect(screen.getByTestId('typed-text').textContent).toBe(typedBefore)
  })

  it('結果のあと、リトライで同じ時間のままやり直せる', () => {
    vi.useFakeTimers()
    renderPracticeScreen('/practice/home-position-basic')
    fireEvent.click(screen.getByRole('button', { name: '3分' }))
    fireEvent.keyDown(screen.getByRole('application'), { key: 'f' })
    act(() => {
      vi.advanceTimersByTime(180_000)
    })
    expect(screen.getByText('結果', { selector: 'h3' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'リトライ' }))

    expect(screen.queryByText('結果', { selector: 'h3' })).not.toBeInTheDocument()
    expect(screen.getByTestId('remaining')).toHaveTextContent('03:00')
    expect(screen.getByTestId('stage')).toHaveTextContent('段階 1 / 11')
  })

  it('1行打ち終えるとすぐ次の行が出る', () => {
    renderPracticeScreen('/practice/home-position-basic')

    typeCurrentLine()

    expect(screen.getByTestId('typed-text').textContent).toBe('')
    expect(currentLineText().length).toBeGreaterThan(0)
    expect(screen.queryByText('結果', { selector: 'h3' })).not.toBeInTheDocument()
  })

  it('段階が上がると、増えたキーとその指が知らされる', () => {
    renderPracticeScreen('/practice/home-position-basic')

    for (let i = 0; i < 4; i++) {
      typeCurrentLine()
    }

    expect(screen.getByTestId('stage')).toHaveTextContent('段階 2 / 11')
    expect(screen.getByRole('status')).toHaveTextContent(
      'D が増えたよ（左手・中指）／K が増えたよ（右手・中指）',
    )
  })

  it('次の文字がスペースのとき ␣ で見え、押してもスクロールしない', () => {
    renderPracticeScreen('/practice/home-position-basic')
    const area = screen.getByRole('application')
    const firstChunk = currentLineText().split(' ')[0]

    for (const key of firstChunk) {
      fireEvent.keyDown(area, { key })
    }

    expect(screen.getByTestId('current-text').textContent).toBe('␣')
    expect(screen.getByTestId('finger-label')).toHaveTextContent('スペース：親指')
    expect(fireEvent.keyDown(area, { key: ' ' })).toBe(false)
    expect(screen.getByTestId('typed-text').textContent).toBe(`${firstChunk} `)
  })
})
