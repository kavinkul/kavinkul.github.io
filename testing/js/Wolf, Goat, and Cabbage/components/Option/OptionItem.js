function OptionItem({ selected, onClick, item, specialStyleByItemPredicate }) {
    let style = {
        border: '0px',
        listStyleType: 'none',
        listStylePosition: 'inside',
        textAlign: 'center',
        background: 'white',
        color: 'black',
        height: '20px'
    };

    // Let parent components add dynamic style to an option item.
    if (specialStyleByItemPredicate) {
        style = { ...style, ...specialStyleByItemPredicate(item) };
    }

    if (selected === item) {
        style.background = '#00ccff ';
    }

    const handleClick = () => {
        onClick(item);
    };

    return (
        <li onClick={handleClick} style={style}>
            {item}
        </li>
    );
}

export default OptionItem;
