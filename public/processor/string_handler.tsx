export const extractword = (str: any, start: any, end: any, carrier: any) => {
  var startindex = str.indexOf(start);
  var endindex = str.indexOf(end, startindex);
  if (startindex != -1 && endindex != -1 && endindex > startindex)
    return str.substring(startindex, endindex + carrier)
}

export const parseUrl = async (url: any) => {
  try {
    return decodeURIComponent(url.replace(/\+/g, ' '));
  } catch (e) {
    console.error(e);
  }
}

export const extractBetweenParentheses = (str: any) => {
  try {
    var regExp = /\(([^)]+)\)/;
    let extracted = regExp.exec(str);
    if (extracted) {
      let closeParenthesesCounter = (extracted[1].match(/[)]/g) || []).length;
      let openParenthesesCounter = (extracted[1].match(/[(]/g) || []).length;
      if (openParenthesesCounter > closeParenthesesCounter) {
        extracted[1] = extracted[1] + ")"
      }
    }

    return extracted
  }
  catch (e) {
    console.error(e);
  }
}

export const objectBuilder = (str: any) => {
  try {
    var obj: any = {}
    if (str && str.indexOf(':') !== -1) {
      // var extractedKey = str.substring(
      //   str.indexOf(":"),
      //   str.lastIndexOf(str.length)
      // );
      var extractedKey = str.split(":")[0];
      var value = str.split(':')[1];
      let parsedValue = value.replace(/'/g, '');

      obj[extractedKey] = parsedValue
    }
    return obj
  }
  catch (e) {
    console.error(e);
  }
}

export const mulObjectBuilder = (str: any, target: any, keyName: any) => {
  try {
    let splitedByTarget = str.split(target)
    let splitedArr: any = []
    let objTmp: any
    splitedByTarget.forEach((value: any, key: any) => {
      if (splitedByTarget.length > 1 && key > 0) {
        let insideContent = extractBetweenParentheses(value)
        if (insideContent) {
          objTmp = objectBuilder(insideContent[1])
          let innerObj: any = {}
          innerObj[target] = objTmp
          splitedArr.push(innerObj)
        }
      }
      else if (splitedByTarget.length == 1) {
        let insideContent = extractBetweenParentheses(value)
        if (insideContent) {
          let innerObj: any = {}
          innerObj[keyName] = insideContent[1]
          splitedArr.push(innerObj)
        }
      }
    });
    return splitedArr
  }
  catch (e) {
    console.error(e);
  }
}