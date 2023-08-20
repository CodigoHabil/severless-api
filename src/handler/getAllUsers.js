const { getAllUsers } = require("../services/userService");

module.exports.handler = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Ok!",
          data: await getAllUsers(),
        },
        null,
        2
      ),
    };
  };
  