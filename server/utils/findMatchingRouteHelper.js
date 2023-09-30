import routeList from "./routeList.js";

const findMatchingRouteHelper = ( url, method ) => {
  for( const route of routeList ){
    const routePath = route.path;
    const routeMethod = route.method;
    
    // URL ile route path'i karşılaştır
    const routePattern = routePath.replace(/:[^/]+/g, '[^/]+'); // Parametreleri regex ile eşleştirelim
    const regex = new RegExp(`^${routePattern}$`);
    
    if (regex.test( url ) && routeMethod === method) {
      const path = routePath.split( '/:' )[ 0 ];
      return path;
    }
  }

  return null; // Eşleşen bir route bulunamadı
}

export default findMatchingRouteHelper;