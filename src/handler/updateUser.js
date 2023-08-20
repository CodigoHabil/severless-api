const { updateUser } = require('../services/userService');

module.exports.handler = async (event) => {
    const response = await updateUser(event);
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "Ok!",
                data: response,
            },
            null,
            2
        ),
    };
}