const { createUser } = require('../services/userService');

module.exports.handler = async (event) => {
    const response = await createUser(event);
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "Ok!",
                data: response,
                event: event
            },
            null,
            2
        ),
    };
}