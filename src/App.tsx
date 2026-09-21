import { PracticeScreen } from './features/practice/PracticeScreen.tsx'

function App() {
  return (
    <main>
      <h1>TypingSuite</h1>
      <p>タイピングの練習・記録・検定をひとつに</p>
      {/* 疎通確認のため一時的に描画。正式な画面遷移は別workで対応 */}
      <PracticeScreen />
    </main>
  )
}

export default App
