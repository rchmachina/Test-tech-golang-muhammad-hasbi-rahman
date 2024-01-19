const cookieExists = (name) => {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith(name + '='));
  };
  
  export default cookieExists;
  