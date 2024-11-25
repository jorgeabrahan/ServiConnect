import { WrapperInput } from '../Wrappers'

export const CxSelect = ({
  label,
  id,
  value,
  required = false,
  disabled = false,
  onChange,
  options = []
}: {
  label: string
  id: string
  placeholder?: string
  value?: string
  required?: boolean
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options?: { id: string; label: string }[]
}) => {
  return (
    <WrapperInput label={label} id={id}>
      <select
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm ${
          disabled && 'opacity-50'
        }`}
      >
        {options.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </WrapperInput>
  )
}
