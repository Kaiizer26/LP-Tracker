export const logout = (router) => {
    
    localStorage.removeItem('authToken');
  
    
    if (router) {
      router.push('/');
    } else {
      window.location.href = '/';
    }
  };