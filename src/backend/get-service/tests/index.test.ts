import { getTeam } from '../src/index';
import { Callback, Context } from 'aws-lambda';
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