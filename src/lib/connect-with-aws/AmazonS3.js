'use strict;';

const AWS = require('aws-sdk');


function AmazonS3() {};
AmazonS3.fetchDataFromAmazonS3 = function(key) {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    const params = {
      Bucket: `cointaxpay-database/users/${AWS.config.credentials.identityId}`,
      Key: key
    };
    s3.getObject(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        // The data.Body can be parsed like this: JSON.parse(String.fromCharCode(...data.Body)
        resolve(data.Body);
      }
    });
  });
};

AmazonS3.saveDataToAmazonS3 = function(key, data) {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    const params = {
      Body: JSON.stringify(data),
      ContentType: "application/json",
      Bucket: `cointaxpay-database/users/${AWS.config.credentials.identityId}`,
      Key: key,
      ServerSideEncryption: "AES256",
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

AmazonS3.fetchMetaDataFromAmazonS3 = function(key) {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    const params = {
      Bucket: `cointaxpay-database/users/${AWS.config.credentials.identityId}`,
      Key: key
    };
    s3.headObject(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export default AmazonS3;

