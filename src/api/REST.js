async function sendRESTCommand(url, method = 'GET', caller, jwttok, body) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", jwttok);
    const requestOptions = {
      method: method,
      headers: myHeaders,
      body: body,
      redirect: 'follow'
    }
    return await fetch(url, requestOptions)
  } catch (e) {
    console.warn('Error:', e.message())
  }

}


export default sendRESTCommand