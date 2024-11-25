'use client'
import { WrapperContentDelimiter, WrapperProtectedRoute } from '@/components'

export default function Dashboard() {
  return (
    <WrapperProtectedRoute>
      <WrapperContentDelimiter>
        <h1>PageDashboard</h1>
      </WrapperContentDelimiter>
    </WrapperProtectedRoute>
  )
}
