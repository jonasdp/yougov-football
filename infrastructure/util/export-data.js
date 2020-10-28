'use strict'

const fs = require('fs')
const AWS = require('aws-sdk')

const fileName = '../data/yougov-football-data.json'

const credentials = new AWS.SharedIniFileCredentials({ profile: 'jonasdp-aws-main--jonas' })

AWS.config = new AWS.Config({
  credentials: credentials,
  region: 'eu-west-1'
})

const dynamodb = new AWS.DynamoDB()

fs.readFile(fileName, (err, data) => {
  if (err) throw err
  let jsonData = JSON.parse(data)

  jsonData.forEach((element) => {
    let putItemParams = {
      Item: {
        name: {
          S: element.name
        },
        img: {
          S: element.img
        }
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: 'yougovFootballTeams'
    }

    dynamodb.putItem(putItemParams, function (err, data) {
      if (err) console.log(err, err.stack)
      else console.log(data)
    })
  })
})
