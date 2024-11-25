export const WrapperInput = ({
  label,
  id,
  children
}: {
  label: string
  id: string
  children: React.ReactNode
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-gray-700 capitalize'
      >
        {label}
      </label>
      {children}
    </div>
  )
}
