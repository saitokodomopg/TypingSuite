import { Route, Routes } from 'react-router-dom'
import { MenuScreen } from './features/menu/MenuScreen.tsx'
import { PracticeScreen } from './features/practice/PracticeScreen.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuScreen />} />
      <Route path="/practice/:taskId" element={<PracticeScreen />} />
    </Routes>
  )
}

export default App
