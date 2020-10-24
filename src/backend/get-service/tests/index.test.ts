import { getTeam } from '../src/index';
import { Callback, Context, APIGatewayProxyEvent } from 'aws-lambda';
import { mocked } from 'ts-jest/utils';

let str: string;
const obj = {};
let array: any[];
let num: number;
let error: Error;
let bool: boolean;

const context = {
  awsRequestId: 'id'
}

const event: APIGatewayProxyEvent = {
  body: '',
  headers: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '',
  pathParameters: {},
  queryStringParameters: [name: ''],
  stageVariables: {},
  requestContext: {},
  resource: '' 
};

let callback: Callback;

describe('Get Service', function () {
  it('event', async () => {
    const result = await getTeam(obj, context, callback);

    expect(result).toBe({
      statusCode: 200,
      body: {
        message: 'response'
      }
    });
  });
});