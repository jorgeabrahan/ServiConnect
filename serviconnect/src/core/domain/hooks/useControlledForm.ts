import React, { useRef, useState } from 'react'

export const useControlledForm = <
  T extends Record<string, string | boolean | number>
>(
  initialFormState: T
) => {
  const getInitialFormErrors = () => {
    return Object.keys(initialFormState).reduce((errors, key) => {
      errors[key as keyof T] = ''
      return errors
    }, {} as { [K in keyof T]: string })
  }
  const [formState, setFormState] = useState<T>(initialFormState)
  const [formErrors, setFormErrors] = useState<{ [K in keyof T]: string }>(
    () => {
      return getInitialFormErrors()
    }
  )
  const hasErrorsRef = useRef(false)
  const onInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = event.target
    setFormState((prevState) => ({
      ...prevState,
      [name]:
        type === 'checkbox'
          ? (event.target as HTMLInputElement)?.checked
          : value
    }))
  }
  const updateInputValue = (
    inputName: keyof T,
    value: string | boolean | number
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [inputName]: value
    }))
  }
  const clearFormErrors = () => {
    setFormErrors(getInitialFormErrors())
    hasErrorsRef.current = false
  }
  const resetForm = () => {
    setFormState(initialFormState)
    clearFormErrors()
  }
  const attachInputError = (inputName: keyof T, error: string) => {
    hasErrorsRef.current = hasErrorsRef.current || error !== ''
    setFormErrors((prevErrors) => {
      const updatedErrors: { [K in keyof T]: string } = prevErrors
        ? prevErrors
        : ({} as { [K in keyof T]: string })
      updatedErrors[inputName] = error
      return updatedErrors as { [K in keyof T]: string }
    })
  }
  return {
    ...formState,
    form: {
      ...Object.keys(formState).reduce((acc, key) => {
        const inputKey = key as keyof T
        acc[inputKey] = {
          id: inputKey,
          value: formState[inputKey],
          error: formErrors[inputKey] || ''
        }
        return acc
      }, {} as { [K in keyof T]: { id: K; value: T[K]; error: string } }),
      reset: resetForm,
      clearErrors: clearFormErrors,
      hasErrors: () => hasErrorsRef.current
    },
    onInputChange,
    updateInputValue,
    setFormState,
    attachInputError
  }
}
