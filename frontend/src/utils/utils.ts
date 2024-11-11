export function errorHandler(err: any) {
  if (err.status === 401 || err.status === 400) {
    const errorBody = err.response?.data?.detail;
    if (errorBody === 'User email not verified!') {
      return errorBody;
    } else if (errorBody === 'Invalid email or password!') {
      return errorBody;
    } else {
      return 'Bad Request Error';
    }
  } else if (err.status === 500) {
    return 'Internal Server Error';
  } else {
    return 'Unknown Error Encountered';
  }
}

export function formatFloat(number: string | number, decimalPlaces: number) {
  return Number(number).toLocaleString('en-US', { minimumFractionDigits: decimalPlaces });
}
