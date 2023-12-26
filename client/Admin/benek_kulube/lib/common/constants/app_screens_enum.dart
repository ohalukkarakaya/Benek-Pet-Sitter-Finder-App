enum AppScreenEnums {
  LOADING_SCREEN,
  LOGIN_SCREEN,
  HOME_SCREEN,
  ERROR_SCREEN,
}

String getRouteName( AppScreenEnums activeScreen ){
  switch( activeScreen ){
    case AppScreenEnums.LOADING_SCREEN:
      return "/loadingScreen";
    case AppScreenEnums.LOGIN_SCREEN:
      return "/loginScreen";
    case AppScreenEnums.HOME_SCREEN:
      return "/homeScreen";
    case AppScreenEnums.ERROR_SCREEN:
      return "/errorScreen";
    default:
      return "/errorScreen";
  }
}