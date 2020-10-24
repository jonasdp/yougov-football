/*
export const handler = async (event: any = {}): Promise<any> => {
  console.log('==> ', event)
  const response = JSON.stringify(event, null, 2);
  return response;
}
*/

/*
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const queries = JSON.stringify(event.queryStringParameters);
  return {
    statusCode: 200,
    body: `Queries: ${queries}`
  }
}
*/

import { Handler, Context, Callback } from 'aws-lambda';

interface Response {
  statusCode: number;
  body: string;
}

const getTeam: Handler = async (event: any, context: Context, callback: Callback): Promise<any> => {
  const response: Response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'response'
    })
  };
  
  callback(new Error());
  callback(null, response);
  return response;

};

export { getTeam }