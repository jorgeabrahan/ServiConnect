import axios from 'axios'
import { StandardApiResponse } from '../types'
import { Category } from '../entities'
import { API_URL } from 'config'
import { toast } from 'sonner'

export const getCategories = async () => {
  try {
    const response = await axios.get<StandardApiResponse<Category[]>>(
      `${API_URL}/categories`
    )
    const { isSuccess, data: responseData, error } = response.data

    if (!isSuccess || !responseData) {
      toast.error(error)
      return response.data
    }
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to get categories'
    toast.error(fallbackError)
    return {
      isSuccess: false,
      data: null,
      error: fallbackError
    }
  }
}

export const getCategoryById = async (id: string) => {
  try {
    const response = await axios.get<StandardApiResponse<Category>>(
      `${API_URL}/categories/${id}`
    )
    const { isSuccess, data: responseData, error } = response.data
    if (!isSuccess || !responseData) {
      toast.error(error)
      return response.data
    }
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to get category'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}
