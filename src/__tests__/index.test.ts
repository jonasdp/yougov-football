import jestConfig from '../jest.config'
import AWSMock from 'aws-sdk-mock'
//import AWS from 'aws-sdk'
import { AWS, handler } from '..'
import { GetItemInput } from 'aws-sdk/clients/dynamodb'

const getDynamoResponse = {
  name: 'Liverpool',
  img: 'https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/646.jpg'
}

const scanDynamoResponse = {
  Items: [
    {
      name: 'Arsenal',
      img: 'https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/632.jpg'
    },
    {
      name: 'Bournemouth',
      img: 'https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/631.jpg'
    },
    {
      name: 'Brighton & Hove Albion',
      img: 'https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/2465.jpg'
    }
  ]
}

beforeAll(async (done) => {
  //handler requires env vars
  done()
})

describe('Yougov Tests', () => {
  it('Get all teams', async () => {
    AWSMock.setSDKInstance(AWS)
    // Overwriting DynamoDB.DocumentClient.get()
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: GetItemInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'scan', 'mock called')
      callback(null, scanDynamoResponse)
    })

    const event = {
      httpMethod: 'GET'
    }

    const response = await handler(event)

    expect(JSON.parse(response.body)).toEqual([
      {
        name: 'Arsenal',
        img: 'https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/632.jpg'
      },
      {
        name: 'Bournemouth',
        img: 'https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/631.jpg'
      },
      {
        name: 'Brighton & Hove Albion',
        img: 'https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/2465.jpg'
      }
    ])

    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('Get one team', async () => {
    AWSMock.setSDKInstance(AWS)
    // Overwriting DynamoDB.DocumentClient.get()
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'get', 'mock called')
      callback(null, getDynamoResponse)
    })

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        name: 'Liverpool'
      }
    }

    const response = await handler(event)

    expect(JSON.parse(response.body)).toEqual({
      name: 'Liverpool',
      img: 'https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/646.jpg'
    })

    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('Create team', async () => {
    AWSMock.setSDKInstance(AWS)
    // Overwriting DynamoDB.DocumentClient.get()
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: GetItemInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'put', 'mock called')
      callback(null, getDynamoResponse)
    })

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        name: 'Liverpool',
        img: 'IMAGE'
      })
    }

    const response = await handler(event)

    expect(response.statusCode).toEqual(200)

    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('Invalid httpmethod', async () => {
    const event = {
      httpMethod: 'PUT'
    }

    const response = await handler(event)

    expect(response.statusCode).toEqual(400)

    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('Invalid POST request', async () => {
    const event = {
      httpMethod: 'POST'
    }

    const response = await handler(event)

    expect(response.statusCode).toEqual(400)

    AWSMock.restore('DynamoDB.DocumentClient')
  })
})
