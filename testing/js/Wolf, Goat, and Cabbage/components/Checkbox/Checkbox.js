import useRawIcon from '../../hooks/use-raw-icon';

const { useId } = window.React;

function Checkbox({ label, isChecked, style, className, ...rest }) {
    const id = useId();
    const { rawGoCheck } = useRawIcon();

    const baseStyle = {
        width: '1.5em',
        height: '1.5em',
        border: '1px solid black',
        borderRadius: '25%',
        margin: '1em 1em',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
        verticalAlign: 'middle',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundColor: 'red'
    };

    const labelStyle = { position: 'relative', bottom: '-2.5px' };

    const checkedStyle = isChecked
        ? { backgroundImage: `url('data:image/svg+xml,${rawGoCheck}')` }
        : null;

    const finalStyle = { ...baseStyle, ...style, ...checkedStyle };

    return (
        <Fragment>
            <input
                id={id}
                name={id}
                style={finalStyle}
                className={className}
                type="checkbox"
                {...rest}
            />
            <label style={labelStyle} htmlFor={id}>
                {label}
            </label>
        </Fragment>
    );
}

export default Checkbox;
