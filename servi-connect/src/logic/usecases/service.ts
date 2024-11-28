import axios from 'axios'
import { StandardApiResponse } from '../types'
import { Service } from '../entities'
import { API_URL } from 'config'
import { toast } from 'sonner'

interface ServiceRequestDto {
  serviceId: string
  description: string
  date: string
  time: string
  hoursBooked: number
  specificationAmounts: {
    serviceSpecificationAmountId: string
    value: number
  }[]
}

export const getServiceById = async (id: string) => {
  try {
    const response = await axios.get<StandardApiResponse<Service>>(
      `${API_URL}/services/${id}`
    )
    const { isSuccess, data: responseData, error } = response.data
    if (!isSuccess || !responseData) {
      toast.error(error)
      return response.data
    }
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to get service by ID'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}

export const createServiceRequest = async (
  userId: string,
  body: ServiceRequestDto,
  token: string
) => {
  try {
    const response = await axios.post<StandardApiResponse<Service>>(
      `${API_URL}/service-requests/user/${userId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const { isSuccess, data: responseData, error } = response.data
    if (!isSuccess || !responseData) {
      toast.error(error)
      return response.data
    }
    toast.success('Service request created successfully')
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to create service request'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}
