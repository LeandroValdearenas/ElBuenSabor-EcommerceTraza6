export const ChevronDown = ({fill='none', size=20, height=20, width=20, ...props}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const SearchIcon = ({
    size = 24,
    strokeWidth = 1.5,
    width = 20,
    height = 20,
    ...props
  }) => (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );

export const DeleteIcon = ({
    size = 24,
    strokeWidth = 1.5,
    width = 20,
    height = 20,
    color = '#231F20',
    ...props
  }) => (
    <svg 
      width={width || size} 
      focusable="false" 
      height={height || size} 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13 17" 
      {...props}
      >
    <path 
      d="M1.25 14.625C1.25 15.5875 2.0375 16.375 3 16.375H10C10.9625 16.375 11.75 15.5875 11.75 14.625V4.125H1.25V14.625ZM12.625 1.5H9.5625L8.6875 0.625H4.3125L3.4375 1.5H0.375V3.25H12.625V1.5Z" 
      fill={color}
      />
    </svg>
  );
