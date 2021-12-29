function isInteger(value) {
    if((typeof value == 'number' && value % 1 === 0)
        || typeof value == 'string' && /^\d+$/.test(value)
    )
        return true;
    else return false;
}

function isAddress(value) {
    if(typeof value == 'string' && /^0x[\d\w]{12,}/.test(value))
        return true;
    else return false;
}

module.exports = { isInteger, isAddress }
