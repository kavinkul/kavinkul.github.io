function arraysEqual(arr1, arr2) {
    return (
        arr1.length === arr2.length &&
        arr1.every((ele, index) => {
            return ele === arr2[index];
        })
    );
}

export default arraysEqual;
