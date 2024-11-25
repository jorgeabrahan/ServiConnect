'use client'
import { WrapperInput } from '@/components/Wrappers'

interface CxInputProps extends React.ComponentProps<'input'> {
  label: string
  id: string
  placeholder?: string
  value?: string
  type?: string
  required?: boolean
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const CxInput: React.FC<CxInputProps> = ({
  label,
  id,
  placeholder,
  value,
  type = 'text',
  required = false,
  disabled = false,
  onChange,
  ...props
}) => {
  return (
    <WrapperInput label={label} id={id}>
      <input
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete='off'
        spellCheck='false'
        required={required}
        disabled={disabled}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm ${
          disabled && 'opacity-50'
        }`}
        {...props}
      />
    </WrapperInput>
  )
}
