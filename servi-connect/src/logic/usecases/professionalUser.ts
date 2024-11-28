import axios from 'axios'
import { StandardApiResponse } from '../types'
import { ProfessionalUser, ProfessionalUserServiceArea } from '../entities'
import { API_URL } from 'config'
import { toast } from 'sonner'

interface ProfessionalUserServiceAreaDto {
  countryDepartmentCityId: string
}

export const getProfessionalUser = async (userId: string, token: string) => {
  try {
    const response = await axios.get<StandardApiResponse<ProfessionalUser>>(
      `${API_URL}/professional-users/${userId}`,
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
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to get professional user'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}

export const createProfessionalUser = async (userId: string, token: string) => {
  try {
    const response = await axios.post<StandardApiResponse<ProfessionalUser>>(
      `${API_URL}/professional-users/${userId}`,
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
    toast.success('Professional user created successfully')
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to create professional user'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}

export const createProfessionalUserServiceArea = async (
  userId: string,
  body: ProfessionalUserServiceAreaDto,
  token: string
) => {
  try {
    const response = await axios.post<
      StandardApiResponse<ProfessionalUserServiceArea>
    >(`${API_URL}/professional-users/${userId}/service-areas`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { isSuccess, data: responseData, error } = response.data
    if (!isSuccess || !responseData) {
      toast.error(error)
      return response.data
    }
    toast.success('Service area added successfully')
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(error)
    const fallbackError = 'Failed to add service area to professional user'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}

export const deleteProfessionalUserServiceArea = async (
  userId: string,
  serviceAreaId: string,
  token: string
) => {
  try {
    const response = await axios.delete<
      StandardApiResponse<ProfessionalUserServiceArea>
    >(
      `${API_URL}/professional-users/${userId}/service-areas/${serviceAreaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const { isSuccess, error } = response.data
    if (!isSuccess) {
      toast.error(error)
      return response.data
    }
    toast.success('Service area removed successfully')
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to remove service area from professional user'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}
