import AWS from 'aws-sdk';

import {APIGatewayResponse} from './lib/api-gateway-response';
import {APIGatewayEvent} from './lib/api-gateway-event';
import {IFootballTeam} from './lib/IFootballTeam';

export async function YougovFootballHandler(event: APIGatewayEvent): Promise<APIGatewayResponse> {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  console.log('Received event:', JSON.stringify(event, null, 2));

  const tableName = "yougovFootballTeams";

  let teamName: string;

  let footballTeam: IFootballTeam = {
    name: '',
    img: ''
  }

  let response: APIGatewayResponse = {
    statusCode: 200,
    body: ''
  }

  if(event.body){
    let body = JSON.parse(event.body);
    footballTeam.name = body.name;
    footballTeam.img = body.img;
  }
  
  try {
      switch (event.httpMethod) {
          case 'GET':
              if (event.pathParameters && event.pathParameters.name) {
                  teamName= event.pathParameters.name;

                  const params = {
                    TableName: tableName,
                    Key: {
                        name: teamName
                    }
                  }

                  const result = await dynamodb.get(params).promise();

                  response.body = JSON.stringify(result);
              }
              else {
                  const params = {
                      TableName: tableName
                  }
                  const result = await dynamodb.scan(params).promise();

                  response.body = JSON.stringify(result.Items);
              }

              break;
          case 'POST':
                  const params = {
                      TableName: tableName,
                      Item: {
                          name: footballTeam.name,
                          img: footballTeam.img
                      }
                  }
                  const result = await dynamodb.put(params).promise();

                  response.body = JSON.stringify(result);
              break;
          default:
              throw new Error(`Unsupported method "${event.httpMethod}"`);
      }
  }
  catch (err) {
      response.statusCode = 400;
      response.body = err.message;
  }
  finally {
    response.body = JSON.stringify(response.body);
  }

  return response;
}