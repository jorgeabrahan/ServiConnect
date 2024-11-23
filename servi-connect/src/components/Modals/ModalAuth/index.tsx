'use client'
import { WrapperModal } from '@/components/Wrappers'
import { HeaderModal } from '../HeaderModal'
import { storeModalAuth } from '@/logic/stores'
import { TabLogin } from './TabLogin'
import { TabSignUp } from './TabSignUp'

export const ModalAuth = () => {
  const tab = storeModalAuth((store) => store.tab)
  const isOpen = storeModalAuth((store) => store.isOpen)
  const close = storeModalAuth((store) => store.close)
  return (
    <WrapperModal open={isOpen} onClose={close}>
      <HeaderModal
        title={tab === 'login' ? 'Login' : 'Sign Up'}
        onClose={close}
        className='mb-4'
      />
      {tab === 'login' && <TabLogin />}
      {tab === 'signup' && <TabSignUp />}
    </WrapperModal>
  )
}
