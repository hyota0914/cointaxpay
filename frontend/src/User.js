'use strict;';

const AWS = require('aws-sdk');
const AWSCognito = require('amazon-cognito-identity-js');
const USER_POOL_ID = 'ap-northeast-1_jk1BdhMft';
const CLIENT_ID = 'b5edjf7bm6ql7etadl4q691dh';
const IDENTITY_POOL_ID = 'ap-northeast-1:54456a6d-a520-4702-9d78-f260427e1f01';
const AWS_REGION = 'ap-northeast-1';

function getUserPool() {
  return new AWSCognito.CognitoUserPool({
    UserPoolId : USER_POOL_ID,
    ClientId : CLIENT_ID,
  });
}

function getCognitoUser(username) {
  return new AWSCognito.CognitoUser({
    Username : username,
    Pool : getUserPool(),
  });
}

function User() {};
User.getUsername = function() {
  const user = getUserPool().getCurrentUser();
  if (!user) {
    return undefined;
  }
  return user.getUsername();
}

User.isSignedIn = function() {
  if (getUserPool().getCurrentUser()) return true;
  return false;
}

User.checkAuthenticated = function() {
  return new Promise((resolve, reject) => {
    User.getSession()
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

//https://github.com/aws/amazon-cognito-identity-js
User.signUpToAmazonCognitoUserPool = function(username, email, password) {
  const attributeList = [];
  const dataEmail = {
    Name : 'email',
    Value : email,
  };
  attributeList.push(new AWSCognito.CognitoUserAttribute(dataEmail));
  return new Promise((resolve, reject) => {
    getUserPool().signUp(username, password, attributeList, null, function(err, result){
      if (err) {
        reject(err);
        return;
      }
      resolve(result.user);
    });
  });
}

User.signOut = function() {
  const cognitoUser = getUserPool().getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
}

// https://github.com/aws/amazon-cognito-identity-js/
User.confirmAmazonCognitoUser = function(username, code) {
  return new Promise((resolve, reject) => {
    getCognitoUser(username).confirmRegistration(code, true, function(err, result) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

// https://github.com/aws/amazon-cognito-identity-js/
User.resendConfirmationCode = function(username) {
  return new Promise((resolve, reject) => {
    getCognitoUser(username).resendConfirmationCode(function(err, result) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

// https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html
// https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/authentication-flow.html
User.authenticateAmazonCognitoUser = function(username, password) {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username : username,
      Password : password,
    };
    const authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);
    getCognitoUser(username).authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        //User.accessToken = result.getAccessToken().getJwtToken();
        //User.idToken = result.idToken.jwtToken;
        console.log('access token + ' + result.getAccessToken().getJwtToken());
        console.log('idToken + ' + result.idToken.jwtToken);
        console.log(getUserPool().getCurrentUser());
        resolve();
      },
      onFailure: function(err) {
        reject(err);
      },
    });
  });
}

User.getSession = function() {
  return new Promise((resolve, reject) => {
    const cognitoUser = getUserPool().getCurrentUser();
    if (!cognitoUser) {
      reject("Not logged in");
      return;
    }
    cognitoUser.getSession(function(err, session) {
      if (err) {
        reject(err);
      }
      if (session.isValid() === false) {
        reject("Session is invalid");
      }
      resolve(session);
    });
  });
}

// https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html
// https://github.com/aws/amazon-cognito-identity-js : Use case 17
// https://gist.github.com/kndt84/5be8e86a15468ed1c8fc3699429003ad
User.refresh = function() {
  return new Promise((resolve, reject) => {
    User.getSession()
    .then((session) => {
      const loginInfo = {};
      loginInfo[`cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`] = session.getIdToken().getJwtToken();
      AWS.config.update({
        region: 'ap-northeast-1',
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: IDENTITY_POOL_ID,
          Logins: loginInfo,
        }),
      });
      AWS.config.credentials.refresh((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
    .catch(err => reject(err));
  });
}

export default User;
