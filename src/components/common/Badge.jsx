import './Badge.css';

const Badge = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    ...props
}) => {
    const classes = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes} {...props}>
            {icon && <span className="badge-icon">{icon}</span>}
            {children}
        </span>
    );
};

export default Badge;
