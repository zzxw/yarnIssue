import axios from 'axios';

var baseurl = "http://localhost:8888/"; //10.39.101.76:8888

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

function getServiceUrl(){
  return baseurl;
}

export default {
  getServiceUrl
}
