enum AppScreens {
  LOADING_SCREEN,
  LOGIN_SCREEN,
  HOME_SCREEN,
  ERROR_SCREEN,
}

String getRouteName( AppScreens activeScreen ){
  switch( activeScreen ){
    case AppScreens.LOADING_SCREEN:
      return "/loadingScreen";
    case AppScreens.LOGIN_SCREEN:
      return "/loginScreen";
    case AppScreens.HOME_SCREEN:
      return "/homeScreen";
    case AppScreens.ERROR_SCREEN:
      return "/errorScreen";
    default:
      return "/errorScreen";
  }
}