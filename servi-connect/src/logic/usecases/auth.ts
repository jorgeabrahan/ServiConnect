import axios from 'axios'
import { User } from '@/logic/entities'
import { storeAuth } from '../stores'
import { API_URL } from 'config'
import { toast } from 'sonner'
import { StandardApiResponse } from '../types'

interface LoginData {
  email: string
  password: string
}

interface SignupData {
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

export const login = async (data: LoginData) => {
  try {
    const response = await axios.post<StandardApiResponse<AuthResponse>>(
      `${API_URL}/auth/login`,
      data
    )
    const { isSuccess, data: responseData, error } = response.data

    if (!isSuccess || !responseData) return toast.error(error)
    const { user, access_token } = responseData
    storeAuth.getState().login(user, access_token)
  } catch (error) {
    toast.error('Failed to login')
  }
}

export const signup = async (data: SignupData) => {
  try {
    const response = await axios.post<StandardApiResponse<AuthResponse>>(
      `${API_URL}/auth/signup`,
      data
    )
    const { isSuccess, data: responseData, error } = response.data

    if (!isSuccess || !responseData) return toast.error(error)
    const { user, access_token } = responseData
    storeAuth.getState().login(user, access_token)
  } catch (error) {
    toast.error('Failed to sign up')
  }
}
