/**
 * 
 * @param  {[String]}        email  Can be a string or array of string of emails
 * @param  {Sequelize Model} model  Database table to be queried 
 * @return {[Number]}               Id of result obtained from email provided 
 */
exports.getIdWithEmail = async (email, model) => {
    const idResult = await model.findAll({
        attributes: [
            'id'
        ],
        where: { email: email }
    }); 

    if (idResult.length === 0) {
        const errorMessage = JSON.stringify({ message: 'No records found with provided email.' });
        const error = new Error(errorMessage);
        error.statusCode = 400;
        throw error;
    }

    let idArray = []

    idResult.forEach( row => {
        idArray.push(row['id']);
    })

    return idArray;
};

exports.getIdOfStudentNotSuspended = async (email, model) => {
    const idResult = await model.findAll({
        attributes: [
            'id'
        ],
        where: { email: email, suspended: false }
    }); 

    if (idResult.length === 0) {
        const errorMessage = JSON.stringify({ message: 'Student record not found in database.' });
        const error = new Error(errorMessage);
        error.statusCode = 400;
        throw error;
    }

    let idArray = []

    idResult.forEach( row => {
        idArray.push(row['id']);
    })

    return idArray;

};

exports.getEmailById = async (id, model) => {
    const result = await model.findAll({
        attributes: [
            'email'
        ],
        where: { id: id }
    });

    if (result.length === 0) {
        const errorMessage = JSON.stringify({ message: 'Unable to get email.' });
        const error = new Error(errorMessage);
        error.statusCode = 400;
        throw error;
    }

    let emailArray = [];

    result.forEach(row => {
        emailArray.push(row['email']);
    })

    console.log(emailArray);

    return emailArray;
};

exports.isStudentSuspended = async (email, model) => {
    const result = await model.findAll({
        attributes: [
            'suspended'
        ],
        where: { email: email }
    });

    if (result.length === 0) {
        console.log('Student does not exist');
        return -1;
    }

    return result[0]['suspended'];
};

