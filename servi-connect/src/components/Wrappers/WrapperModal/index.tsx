'use client'

import { WrapperContentDelimiter } from '../WrapperContentDelimiter'

interface WrapperModalProps {
  onClose?: () => void
  open?: boolean
  customMaxWidth?: string
  children: React.ReactNode
}
export const WrapperModal: React.FC<WrapperModalProps> = ({
  onClose = () => {},
  open = true,
  customMaxWidth = 'max-w-xl',
  children
}) => {
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target == null) return
    const target = e.target as HTMLElement
    const targetAction = target.getAttribute('data-action')
    if (targetAction === 'close-modal') onClose()
  }
  return (
    <dialog
      className={`fixed inset-0 z-[700] justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm ${
        open && 'flex'
      }`}
      onClick={handleDialogClick}
      data-action='close-modal'
      open={open}
    >
      <WrapperContentDelimiter as='div' data-action='close-modal'>
        <div
          className={`relative bg-white rounded-lg p-4 mx-auto ${customMaxWidth}`}
        >
          {children}
        </div>
      </WrapperContentDelimiter>
    </dialog>
  )
}
