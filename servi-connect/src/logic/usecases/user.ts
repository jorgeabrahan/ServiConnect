import axios from 'axios'
import { StandardApiResponse } from '../types'
import { UserAddressDto, UserAddress } from '../entities/UserAddress'
import { API_URL } from 'config'
import { toast } from 'sonner'

export const getUserAddress = async (userId: string, token: string) => {
  try {
    const response = await axios.get<StandardApiResponse<UserAddress>>(
      `${API_URL}/users/${userId}/address`,
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
    const fallbackError = 'Failed to get address'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}

export const createAddress = async (
  userId: string,
  body: UserAddressDto,
  token: string
) => {
  try {
    const response = await axios.post<StandardApiResponse<UserAddress>>(
      `${API_URL}/users/${userId}/address`,
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
    toast.success('Address created successfully')
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to create address'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}

export const updateAddress = async (
  userId: string,
  addressId: string,
  body: UserAddressDto,
  token: string
) => {
  try {
    const response = await axios.patch<StandardApiResponse<UserAddress>>(
      `${API_URL}/users/${userId}/address/${addressId}`,
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
    toast.success('Address updated successfully')
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to update address'
    toast.error(fallbackError)
    return { isSuccess: false, data: null, error: fallbackError }
  }
}
