
const isEmpty = (str: string) => {
  if(str?.trim().length === 0 || 
  str === null ||
  str === undefined ||
  str === '') {
    return true;
  }
}

export {isEmpty};