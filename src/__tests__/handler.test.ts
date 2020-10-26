import jestConfig from '../jest.config'
import AWSMock from 'aws-sdk-mock'
import AWS from 'aws-sdk'
import { GetItemInput } from 'aws-sdk/clients/dynamodb'
import { handler } from '../handler'

AWS.config.paramValidation = false

const listEvent = {
  body: '',
  httpMethod: 'GET',
  pathParameters: null
}

const dynamoReturnValueList = {
  statusCode: 200,
  body:
    '"[{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/638.jpg\\",\\"name\\":\\"Watford\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/650.jpg\\",\\"name\\":\\"Burnley\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/632.jpg\\",\\"name\\":\\"Arsenal\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/647.jpg\\",\\"name\\":\\"Southampton\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/631.jpg\\",\\"name\\":\\"Bournemouth\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/635.jpg\\",\\"name\\":\\"Chelsea\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/633.jpg\\",\\"name\\":\\"Leicester City\\"},{\\"img\\":\\"https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/646.jpg\\",\\"name\\":\\"Liverpool\\"}'
}

beforeAll(async (done) => {
  //get requires env vars
  done()
})

describe('Yougov Tests', () => {
  AWSMock.setSDKInstance(AWS)
  it('Get all teams', async () => {
    // Overwriting DynamoDB.DocumentClient.get()
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
