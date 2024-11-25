import axios from 'axios'
import { StandardApiResponse } from '../types'
import { Service } from '../entities'
import { API_URL } from 'config'
import { toast } from 'sonner'

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
