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
      className={`px-2 sm:px-4 lg:px-6 xl:px-8 -md:max-h-[500px] -md:overflow-y-scroll scrollbar-hide ${
        matchBlockPadding && 'py-2 sm:py-4 lg:py-6 xl:py-8'
      } ${!hasCustomWidth && 'w-full mx-auto max-w-[1550px]'} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
