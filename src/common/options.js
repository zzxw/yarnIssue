const options = {
  issue_status: {
    'P': 'Pending',
    'K': 'Package',
    'C': 'Close',
    'N': 'Canceled'
  },
  mail_status: {
    'P': 'Pending',
    'L': 'Locked',
    'F': 'Parsed',
    'E': 'Error',
    'I': 'Invalid'
  }
}

function getOptions(opType){
  return options[opType];
}

function getOptionLabel(opType, opValue){
  let obj = options[opType];
  if(!obj){
    return opValue;
  }else{
    let label = obj[opValue];
    if(label){
      return label;
    }else{
      return opValue;
    }
  }
}

export default{
  getOptionLabel,
  getOptions
}