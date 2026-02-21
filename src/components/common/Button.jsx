import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props 
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      type={type}
      className={classes} 
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="btn-spinner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && !loading && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
