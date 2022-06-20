import {useState} from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const clearError = ()=> {
    setError('')
  }

  async function fetchHttp(url, method = 'GET', caller, jwttok, body) {
    try {
      setIsLoading(true)
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
      setError(e.message())
      console.warn('Error:', e.message())
    } finally {
      setIsLoading(false)
    }

  }

  return {fetchHttp, isLoading, error, clearError}
}

export default useHttp