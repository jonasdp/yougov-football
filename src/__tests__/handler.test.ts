import jestConfig from '../jest.config'
import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'
//import AWS from 'aws-sdk'
import { GetItemInput } from 'aws-sdk/clients/dynamodb'
import { handler } from '../handler'

const listEvent = {
  body: '',
  httpMethod: 'GET',
  pathParameters: null
}

const dynamoReturnValueList = {
  statusCode: 200,
  body:
    '"[{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/638.jpg\\",\\"name\\":\\"Watford\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/650.jpg\\",\\"name\\":\\"Burnley\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/632.jpg\\",\\"name\\":\\"Arsenal\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/647.jpg\\",\\"name\\":\\"Southampton\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/631.jpg\\",\\"name\\":\\"Bournemouth\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/635.jpg\\",\\"name\\":\\"Chelsea\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/633.jpg\\",\\"name\\":\\"Leicester City\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/646.jpg\\",\\"name\\":\\"Liverpool\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/639.jpg\\",\\"name\\":\\"Everton\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/648.jpg\\",\\"name\\":\\"Tottenham Hotspur\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/5542.jpg\\",\\"name\\":\\"Cardiff City\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/637.jpg\\",\\"name\\":\\"Crystal Palace\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/5543.jpg\\",\\"name\\":\\"Wolverhampton\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/2464.jpg\\",\\"name\\":\\"Huddersfield Town\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/642.jpg\\",\\"name\\":\\"Manchester City\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/2463.jpg\\",\\"name\\":\\"Newcastle United\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/5770.jpg\\",\\"name\\":\\"Fulham\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/640.jpg\\",\\"name\\":\\"West Ham United\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/645.jpg\\",\\"name\\":\\"Manchester United\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/2465.jpg\\",\\"name\\":\\"Brighton & Hove Albion\\"}]"'
}

beforeAll(async (done) => {
  //get requires env vars
  done()
})

describe('Yougov Tests', () => {
  it('Get all teams', async () => {
    // Overwriting DynamoDB.DocumentClient.get()
    AWSMock.setSDKInstance(require('aws-sdk'))
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'get', 'mock called')
      callback(null, dynamoReturnValueList)
    })

    const input: GetItemInput = { TableName: 'yougovFootballTeams', Key: {} }
    //const client = new AWS.DynamoDB.DocumentClient()

    const result = await handler(listEvent)

    expect(await handler(listEvent)).toStrictEqual(dynamoReturnValueList.body)

    //expect(await client.get(input).promise()).toStrictEqual(JSON.parse(dynamoReturnValueList.body))

    AWSMock.restore('DynamoDB.DocumentClient')
  })
})
