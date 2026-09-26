import {
  fingerLabel,
  fingerOf,
  KEYBOARD_ROWS,
} from '../../core/keyboard/layout.ts'

type KeyHintRowProps = {
  char?: string
  // 含まれないキーを薄く表示する。渡さなければ全部ふつうに表示
  availableKeys?: string[]
}

const SPACE = ' '

const keyClassName = (
  key: string,
  target: string,
  available: boolean,
): string => {
  const classes = ['key-hint', `key-hint-${fingerOf(key)?.finger}`]
  if (key === target) {
    classes.push('key-hint-active')
  }
  if (!available) {
    classes.push('key-hint-unavailable')
  }
  return classes.join(' ')
}

export function KeyHintRow({ char, availableKeys }: KeyHintRowProps) {
  const target = char?.toLowerCase()
  const label = target ? fingerLabel(target) : undefined
  if (!target || !label) {
    return null
  }

  const isAvailable = (key: string) =>
    !availableKeys || key === SPACE || availableKeys.includes(key)
  const targetName = target === SPACE ? 'スペース' : target.toUpperCase()

  return (
    <div className="key-hint-board">
      <div
        className="key-hint-rows"
        role="img"
        aria-label={`次のキー：${targetName}`}
      >
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`key-hint-row key-hint-row-${rowIndex}`}
          >
            {row.map((key) => (
              <span
                key={key}
                className={keyClassName(key, target, isAvailable(key))}
              >
                {key.toUpperCase()}
              </span>
            ))}
          </div>
        ))}
        <div className="key-hint-row key-hint-row-space">
          <span className={keyClassName(SPACE, target, true)}>スペース</span>
        </div>
      </div>
      <p className="key-hint-finger" data-testid="finger-label">
        {targetName}：{label}
      </p>
    </div>
  )
}
