export interface StandardApiResponse<T> {
  isSuccess: boolean
  data: T | null
  error: string | null
}
