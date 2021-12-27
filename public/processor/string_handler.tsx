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