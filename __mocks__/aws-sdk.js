const stubs = require('./aws-stubs');

const AWS = {};
AWS.DynamoDB = {};
AWS.config = {
  setPromisesDependency: (arg) => {},
  region: 'eu-west-1'
};

AWS.DynamoDB.DocumentClient = () => {
};

AWS.DynamoDB.DocumentClient.prototype = {
  ...AWS.DynamoDB.DocumentClient.prototype,

  get(params) {
    get = new Promise((resolve, reject) => {
      resolve(stubs.GetItemOutput);
    })

    return {
      promise: () => {
        return get;
      }
    }
  },

  scan(params) {
    scan = new Promise((resolve, reject) => {
      resolve(stubs.ScanOutput);
    })

    return {
      promise: () => {
        return scan;
      }
    }
  },

  put(params) {
    put = new Promise((resolve, reject) => {
      resolve(stubs.PutItemOutput);
    })

    return {
      promise: () => {
        return put;
      }
    }
  }
};

module.exports = AWS;