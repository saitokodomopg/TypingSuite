import type { ButtonHTMLAttributes } from 'react'

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean
}

export function PillButton({ active, className = '', ...rest }: PillButtonProps) {
  return (
    <button
      type="button"
      className={`pill-button ${className}`.trim()}
      aria-pressed={active}
      {...rest}
    />
  )
}
