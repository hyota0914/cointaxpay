'use strict;';

const EDIT_DATA_VERSION_20180201 = '20180201';

const defaultVal = {
  meta: {
    ver: EDIT_DATA_VERSION_20180201,
  },
}

function EditDataStorage() {};

EditDataStorage.fetchEditData = function(key) {
  return new Promise((resolve, reject) => {
    try {
      const ls = require('storage2').sessionStorage;
      let editData = JSON.parse(ls.getItem(key));
      resolve(editData || defaultVal);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

EditDataStorage.saveEditData = function(key, editData) {
  return new Promise((resolve, reject) => {
    try {
      const ls = require('storage2').sessionStorage;
      ls.setItem(key, JSON.stringify(editData));
      resolve();
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

export default EditDataStorage;
