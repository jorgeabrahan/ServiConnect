import axios from 'axios'
import { toast } from 'sonner'
import { StandardApiResponse } from '../types'
import { CountryDepartment } from '../entities'
import { API_URL } from 'config'

export const getCountryDepartments = async () => {
  try {
    const response = await axios.get<StandardApiResponse<CountryDepartment[]>>(
      `${API_URL}/departments`
    )
    const { isSuccess, data: responseData, error } = response.data

    if (!isSuccess || !responseData) {
      toast.error(error)
      return response.data
    }
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to get country departments'
    toast.error(fallbackError)
    return {
      isSuccess: false,
      data: null,
      error: fallbackError
    }
  }
}
