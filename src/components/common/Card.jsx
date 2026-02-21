import './Card.css';

const Card = ({
    children,
    variant = 'default',
    hover = true,
    padding = 'md',
    className = '',
    onClick,
    ...props
}) => {
    const classes = [
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        hover && 'card-hover',
        onClick && 'card-clickable',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classes}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
