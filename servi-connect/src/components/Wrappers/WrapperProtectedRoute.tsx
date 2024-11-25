import { storeAuth } from '@/logic/stores'
import { redirect } from 'next/navigation'

export const WrapperProtectedRoute = ({
  children
}: {
  children: React.ReactNode
}) => {
  const isAuthenticated = storeAuth((store) => store.isAuthenticated)
  if (!isAuthenticated) redirect('/')
  return children
}
