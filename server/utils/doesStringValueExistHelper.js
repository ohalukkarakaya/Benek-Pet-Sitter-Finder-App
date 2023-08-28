const doesStringValueExistHelper = ( value ) => {
    if(
        !value
        || value === null
        || value === undefined
        || value === "undefined"
        || value === ""
        || value === " "
    ){
        return false;
    }

    return true;
}

export default doesStringValueExistHelper;