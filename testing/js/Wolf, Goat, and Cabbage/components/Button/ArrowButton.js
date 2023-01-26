import Button from './Button';

const { forwardRef } = window.React;

const ArrowButton = forwardRef(
    ({ rawImageString, style, children, ...rest }, ref) => {
        const baseStyle = {
            width: '45px',
            height: '35px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '80% 80%',
            backgroundImage: `url('data:image/svg+xml,${rawImageString}')`
        };

        const finalStyle = { ...baseStyle, ...style };

        return <Button ref={ref} style={finalStyle} {...rest} />;
    }
);

export default ArrowButton;
