import AWS from 'aws-sdk';

import {APIGatewayResponse} from './lib/api-gateway-response';
import {APIGatewayEvent} from './lib/api-gateway-event';

export async function YougovFootballHandler(event: APIGatewayEvent): Promise<APIGatewayResponse> {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  console.log('Received event:', JSON.stringify(event, null, 2));

  var eventbody: object;

  if(event.body){
    eventbody = JSON.parse(event.body);
  }

  let response: APIGatewayResponse = {
    statusCode: 200,
    body: ''
  }

  let statusCode;

  const tableName = "yougovFootballTeams";
  
  try {
      switch (event.httpMethod) {
          case 'GET':
              statusCode = 200;

              if (event.pathParameters && event.pathParameters.name) {
                  const teamName = event.pathParameters.name;

                  const params = {
                      TableName: tableName,
                      Key: {
                          name: teamName
                      }
                  }
                  
                  const result = await dynamodb.get(params).promise();

                  console.log('result', result);
                  response.body = result;
              }
              else {
                  const params = {
                      TableName: tableName
                  }
                  const result = await dynamodb.scan(params).promise();

                  console.log('result', result);
                  response.body = result.Items;
              }

              break;
          case 'POST':
              statusCode = 200;
                  const teamName = eventbody.name;
                  const teaImg = eventbody.img;

                  const params = {
                      TableName: tableName,
                      Item: {
                          name: teamName,
                          img: teaImg
                      }
                  }
                  const result = await dynamodb.put(params).promise();

                  console.log('result', result);
                  response.body = result;
              break;
          default:
              throw new Error(`Unsupported method "${event.httpMethod}"`);
      }
  }
  catch (err) {
      statusCode = 400;
      response.body = err.message;
  }
  finally {
    response.body = JSON.stringify(body);
  }

  return response;
}