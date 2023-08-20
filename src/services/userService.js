const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async () => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: "UserTable",
  };
  const result = await dynamodb.scan(params, error => {
    if(error) {
      console.log("error", error);
    }
  }).promise();


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
      username: body.username,
      email: body.email,
      password: body.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  await dynamodb
    .put(params, (error) => {
      // handle potential errors
      if (error) {
        console.log(error);
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

const updateUser = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  let errorMsg = {};
  const body = JSON.parse(event.body);

  const params = {
    TableName: "UserTable",
    Key: {
      primary_key: event.pathParameters.id,
    },
    UpdateExpression: "set username = :username, email = :email, password = :password, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":username": body.username,
      ":email": body.email,
      ":password": body.password,
      ":updatedAt": new Date().toISOString(),
    },
    ReturnValues: "UPDATED_NEW",
  };

  await dynamodb
    .update(params, (error) => {
      if (error) {
        console.log(error);
        errorMsg = {
          statusCode: error.statusCode || 501,
          headers: { "Content-Type": "text/plain" },
          body: "Couldn't update the item.",
        };
        throw new Error("Couldn't update the todo item.");
      }
    })
    .promise();

  if (errorMsg.statusCode) {
    return errorMsg;
  }

  return JSON.stringify(params.Item);
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser
};
