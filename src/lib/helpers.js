const bcrypt = require('bcryptjs');

const helpers = {}

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

helpers.comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Ups, fallo en la comparacion del password', error);
    }
}

module.exports  = { helpers };