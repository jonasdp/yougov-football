import { YougovFootballHandler } from '../yougov-football-handler';
import { mocked } from 'ts-jest/utils';

const listEvent = {
  body: '',
  httpMethod: 'GET',
  pathParameters: null
}
describe('Yougov Tests', function () {
  it('Get all teams', async () => {
    const result = await YougovFootballHandler(listEvent);
    expect(result).toBe({
      statusCode: 200,
      body: {
        message: 'ok'
      }
    });
  });
});