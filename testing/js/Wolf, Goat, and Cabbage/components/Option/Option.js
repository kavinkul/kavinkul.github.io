import OptionItem from './OptionItem';

function Option({
    ref,
    selected,
    onClick,
    style,
    items,
    specialStyleByItemPredicate,
    ...rest
}) {
    const baseStyle = {
        height: '240px',
        width: '95%',
        overflow: 'hidden',
        overflowY: 'scroll',
        border: '4px solid black',
        listStylePosition: 'inside',
        listStyleType: 'none',
        padding: '0',
        background: 'white'
    };

    const finalStyle = { ...baseStyle, ...style };

    const content = items.map((item, index) => {
        return (
            <OptionItem
                selected={selected}
                onClick={onClick}
                key={index}
                item={item}
                specialStyleByItemPredicate={specialStyleByItemPredicate}
            />
        );
    });

    return (
        <ul style={finalStyle} {...rest}>
            {content}
        </ul>
    );
}

export default Option;
