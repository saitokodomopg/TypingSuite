const KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';']

type KeyHintRowProps = {
  char?: string
}

export function KeyHintRow({ char }: KeyHintRowProps) {
  const target = char?.toUpperCase()
  if (!target || !KEYS.includes(target)) {
    return null
  }

  return (
    <div className="key-hint-row" role="img" aria-label={`次のキー：${target}`}>
      {KEYS.map((key) => (
        <span key={key} className={`key-hint${key === target ? ' key-hint-active' : ''}`}>
          {key}
        </span>
      ))}
    </div>
  )
}
