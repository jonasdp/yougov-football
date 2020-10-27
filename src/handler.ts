//import AWS from 'aws-sdk'
//AWS.config.update({ region: 'eu-west-1' })
//import { DynamoDB } from 'aws-sdk'
export const AWS = require('aws-sdk')

interface IAPIGatewayEvent {
  body?: string
  httpMethod: string
  pathParameters?: { [name: string]: string }
}

interface IAPIGatewayResponse {
  statusCode: number
  body: string
}

interface IFootballTeam {
  name: string
  img?: string
}

class FootballTeam {
  private _name: string
  private _img: string

  constructor(name: string, img: string = '') {
    this._name = name
    this._img = img
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  get img(): string {
    return this._img
  }

  set img(img: string) {
    this._img = img
  }
}

export async function handler(event: IAPIGatewayEvent): Promise<IAPIGatewayResponse> {
  console.log('Received event:', JSON.stringify(event, null, 2))

  //const dynamoDb = AWS.DynamoDB
  //const dynamoClient = new dynamoDb.DocumentClient()

  //AWS.config.update({ region: 'eu-west-1' })
  const dynamoClient = new AWS.DynamoDB.DocumentClient()

  const tableName = process.env.TABLE_NAME || ''

  let response: IAPIGatewayResponse = {
    statusCode: 200,
    body: ''
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        if (event.pathParameters && event.pathParameters.name) {
          const teamName: string = event.pathParameters.name

          const getParams = {
            TableName: tableName,
            Key: {
              name: teamName
            }
          }

          const result = await dynamoClient.get(getParams).promise()

          response.body = result
        } else {
          const getParams = {
            TableName: tableName,
            Key: {}
          }
          const result = await dynamoClient.scan(getParams).promise()

          response.body = result.Items
        }

        break
      case 'POST':
        if (event.body) {
          let body = JSON.parse(event.body)
          const team = new FootballTeam(body.name.trim(), body.img.trim())

          const putParams = {
            TableName: tableName,
            Item: {
              name: team.name,
              img: team.img
            }
          }
          const result = await dynamoClient.put(putParams).promise()
        } else {
          throw new Error(`Body missing"`)
        }
        break
      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`)
    }
  } catch (err) {
    response.statusCode = 400
    response.body = err.message
  } finally {
    response.body = JSON.stringify(response.body)
  }

  return response
}
