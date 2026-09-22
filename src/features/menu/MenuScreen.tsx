import { useNavigate } from 'react-router-dom'
import { list } from '../../core/registry/registry.ts'
import { AppHeader } from '../../shared/ui/AppHeader.tsx'
import { KeyboardIcon } from '../../shared/ui/icons.tsx'
import '../../tasks/index.ts'

export function MenuScreen() {
  const navigate = useNavigate()
  const tasks = list()

  return (
    <div className="screen menu-screen">
      <AppHeader />
      <div className="menu-grid" aria-label="課題一覧">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            className="card menu-card"
            onClick={() => navigate(`/practice/${task.id}`)}
          >
            <KeyboardIcon className="menu-card-icon" />
            <span className="menu-card-label">{task.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
