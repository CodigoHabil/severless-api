const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async () => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: "UserTable",
  };
  const result = await dynamodb.scan(params, error => {
    console.log("error", error);
  }).promise();

  console.log("result", result);

  return result.Items;
};

const createUser = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  let errorMsg = {};
  const body = JSON.parse(event.body);

  const params = {
    TableName: "UserTable",
    Item: {
      primary_key: uuidv4(),
      name: body.name,
      email: body.email,
      password: body.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  await dynamodb
    .put(params, (error) => {
      // handle potential errors
      console.log("error", error);
      if (error) {
        console.error(error);
        errorMsg = {
          statusCode: error.statusCode || 501,
          headers: { "Content-Type": "text/plain" },
          body: "Couldn't create the todo item.",
        };
        return;
      }
    })
    .promise();

  if (errorMsg.statusCode) {
    return errorMsg;
  }

  return JSON.stringify(params.Item);
};

module.exports = {
  getAllUsers,
  createUser,
};
