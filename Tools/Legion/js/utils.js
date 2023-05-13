function RandomChar(length) {
    let output = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = chars.length;
    for (let i = 0; i < length; i++) {
        output += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return output;
}

function RandomNumber(length) {
    return Math.floor(Math.random() * Math.pow(10, length));
}

function AddError(message) {
    errors.push(message);
    console.error(message);
}