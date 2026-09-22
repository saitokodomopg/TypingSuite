import { Link } from 'react-router-dom'
import { KeyboardIcon } from './icons.tsx'

type AppHeaderProps = {
  backToMenu?: boolean
}

export function AppHeader({ backToMenu = false }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-brand">
        <KeyboardIcon className="app-header-logo" />
        <div>
          <h1>TypingSuite</h1>
          <p className="app-header-tagline">タイピングの練習・記録・検定をひとつに</p>
        </div>
      </div>
      {backToMenu && (
        <Link to="/" className="app-header-back">
          ← メニューへ
        </Link>
      )}
    </header>
  )
}
