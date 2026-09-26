import { useNavigate } from 'react-router-dom'
import { list } from '../../core/registry/registry.ts'
import { PillButton } from '../../shared/ui/PillButton.tsx'

export function TaskPills({ taskId }: { taskId: string }) {
  const navigate = useNavigate()
  const tasks = list()

  return (
    <div role="group" aria-label="課題を選ぶ" className="task-pills">
      {tasks.map((t) => (
        <PillButton
          key={t.id}
          active={t.id === taskId}
          onClick={() => navigate(`/practice/${t.id}`)}
        >
          {t.label}
        </PillButton>
      ))}
    </div>
  )
}
