import { XMarkIcon } from '@heroicons/react/24/outline'

interface HeaderModalProps {
  onClose?: () => void
  title?: string
  className?: string
  children?: React.ReactNode
}
export const HeaderModal: React.FC<HeaderModalProps> = ({
  onClose = () => {},
  title = '',
  className = '',
  children
}) => {
  return (
    <header className={`flex justify-between items-center ${className}`}>
      {title ? <h3 className='text-lg font-semibold'>{title}</h3> : children}
      <button
        onClick={onClose}
        type='button'
        className={`hover:scale-110 transition-transform ${className}`}
      >
        <XMarkIcon />
        <span className='sr-only'>Close modal</span>
      </button>
    </header>
  )
}
