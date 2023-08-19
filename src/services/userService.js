const AWS = require('aws-sdk');

const getAllUsers = async () => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: "UserTable",
    };
    const result = await dynamodb.scan(params).promise();
    return result.Items;
}


module.exports = {
    getAllUsers,
}