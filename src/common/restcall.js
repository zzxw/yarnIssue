import axios from 'axios';
import serviceurl from './serviceurl.js';

/**
 * return records
 **/
var baseurl = serviceurl.getServiceUrl();

function init(){
  axios.get("http://10.39.104.39:8761/eureka/apps/CEVC", {})
  .then((response) => {
    let data = response.data;
    if (response.status === 200) {
      let instance = data.application.instance[0];
      let hostname = instance.hostName;
      let ip = instance.ipAddr;
      let port = instance.port.$;
      baseurl = 'http://' + ip + ':' + port + '/';
      console.log('service base url: ' + baseurl);
    }else{ //do nothing. keep default value
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

init();

function changeUrl(url){
  if(url.substring(0,5)==='http:'){
    return url;
  }else{
    return baseurl + url;
  }
}
 
function getRecordsByPost(url, parametersObj, successCallback, failCallback){
  url = changeUrl(url);
  axios.post(url, parametersObj)
  .then((response) => {
    if (response.data.success) {
      console.log(JSON.stringify(response.data));
      let records = convertRecords(response.data);
      successCallback(records, response.data.totalDBRecords);
    }else{
      if(failCallback){
        failCallback(records.data.exception);
      }
    }
  })
  .catch((error) => {
    if(failCallback){
      failCallback(error);
    }
    console.log(error);
  });

}

/**
* private function: to convert records String array to records map
**/
function convertRecords(data){
  let fields = data.recordHead.fields; //[{"name":"ID","sqlType":4,"fullName":"ID"}]
  let records = [];
  data.records.forEach(function(item){ //item is record string array
    let size = fields.length;
    let record = {};
    for(var i=0;i<size;i++){
      let field = fields[i];
      let name = field.name.toLowerCase();
      record[name]= item.values[i];
    }
    records.push(record);
  });
  return records;
}

function getRecordsMap(url, parametersObj, successCallback, failCallback){
  url = changeUrl(url);
  axios.get(url, parametersObj)
  .then((response) => {
    if (response.data.success) {
      let records = convertRecords(response.data);
      successCallback(records, response.data.totalDBRecords);
    }else{
      if(failCallback){
        failCallback(records.data.exception);
      }
    }
  })
  .catch((error) => {
    if(failCallback){
      failCallback(error);
    }
    console.log(error);
  });
}

/**
 * return records
 **/
function getRecordSet(url, parametersObj, successCallback){
  url = changeUrl(url);

  axios.get(url, parametersObj)
  .then((response) => {
    if (response.data.success) {
      let records = response.data.records;
      console.log(JSON.stringify(records));
      successCallback(records);
    }
  })
  .catch((error) => {
    console.log(error);
  });

}

/**
 * return one record
 **/
function getOneRecord(url, parametersObj, successCallback){
  getRecordSet(url, parametersObj, records => {
    if(records){
      if(recods.size() > 0){
        let record = records[0];
        successCallback(record);
      }else{
        successCallback();
      }
    }else{
      successCallback();
    }
  });
}

/**
 * return field value of first colum of first record
 **/
function getOneField(url, parametersObj, successCallback){
  getRecordSet(url, parametersObj, records => {
    if(records){
      let record = records[0];
      let value = record.values[0];
      console.log(value);
      successCallback(value);
    }else{
      successCallback();
    }
  });
}

function getFirstColValues(url, parametersObj, successCallback){
  getRecordSet(url, parametersObj, records => {
    let values = [];
    if(records){
      records.forEach(function(item){
        values.push(item.values[0]);
      });
    }
    successCallback(values);
  });
}

export default {
  baseurl,
  getRecordsByPost,
  getRecordsMap,
  getRecordSet,
  getOneField,
  getFirstColValues
}