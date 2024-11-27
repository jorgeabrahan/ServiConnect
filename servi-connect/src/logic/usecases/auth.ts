import axios from 'axios'
import { User } from '@/logic/entities'
import { API_URL } from 'config'
import { toast } from 'sonner'
import { StandardApiResponse } from '../types'
import { storeAuth } from '../stores'

interface LoginDto {
  email: string
  password: string
}

interface SignupDto {
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumberAreaCode: string
  description: string
  email: string
  password: string
  passwordConfirmation: string
}

interface AuthResponse {
  user: Omit<User, 'password'>
  access_token: string
}

export const login = async (data: LoginDto) => {
  try {
    const response = await axios.post<StandardApiResponse<AuthResponse>>(
      `${API_URL}/auth/login`,
      data
    )
    const { isSuccess, data: responseData, error } = response.data

    if (!isSuccess || !responseData) {
      toast.error(error)
      return response.data
    }
    const { user, access_token } = responseData
    storeAuth.getState().login(user, access_token)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to login'
    toast.error(fallbackError)
    return {
      isSuccess: false,
      data: null,
      error: fallbackError
    }
  }
}

export const signup = async (data: SignupDto) => {
  try {
    const response = await axios.post<StandardApiResponse<AuthResponse>>(
      `${API_URL}/auth/signup`,
      data
    )
    const { isSuccess, data: responseData, error } = response.data

    if (!isSuccess || !responseData) {
      toast.error(error)
      return response.data
    }
    const { user, access_token } = responseData
    storeAuth.getState().login(user, access_token)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    const fallbackError = 'Failed to sign up'
    toast.error(fallbackError)
    return {
      isSuccess: false,
      data: null,
      error: fallbackError
    }
  }
}
