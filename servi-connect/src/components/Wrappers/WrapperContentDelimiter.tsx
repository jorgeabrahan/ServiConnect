interface WrapperContentDelimiterProps {
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  hasCustomWidth?: boolean
  matchBlockPadding?: boolean
}
export const WrapperContentDelimiter: React.FC<
  WrapperContentDelimiterProps
> = ({
  as: Tag = 'main',
  children,
  className,
  hasCustomWidth = false,
  matchBlockPadding = false,
  ...props
}) => {
  return (
    <Tag
      className={`px-2 sm:px-4 lg:px-6 xl:px-8 ${
        matchBlockPadding && 'py-4 sm:py-6 lg:py-8 xl:py-10'
      } ${!hasCustomWidth && 'w-full mx-auto max-w-[1550px]'} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
