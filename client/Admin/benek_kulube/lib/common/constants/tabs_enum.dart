// ignore_for_file: constant_identifier_names

enum AppTabsEnums {
  HOME_TAB,
  LOGS_TAB,
  REPORTED_TAB,
  FILES_TAB,
  EMPLOYEES_TAB,
  CONTACT_MESSAGES_TAB,
  LOGOUT_TAB,
  UN_EXPECTED
}

AppTabsEnums getTabEnum( int activeTab ){
  switch( activeTab ){
    case 0:
      return AppTabsEnums.HOME_TAB;
    case 1:
      return AppTabsEnums.LOGS_TAB;
    case 2:
      return AppTabsEnums.REPORTED_TAB;
    case 3:
      return AppTabsEnums.FILES_TAB;
    case 4:
      return AppTabsEnums.EMPLOYEES_TAB;
    case 5:
      return AppTabsEnums.CONTACT_MESSAGES_TAB;
    case 6:
      return AppTabsEnums.LOGOUT_TAB;
    default:
      return AppTabsEnums.UN_EXPECTED;
  }
}

int getTabId( AppTabsEnums activeTab ){
  switch( activeTab ){
    case AppTabsEnums.HOME_TAB:
      return 0;
    case AppTabsEnums.LOGS_TAB:
      return 1;
    case AppTabsEnums.REPORTED_TAB:
      return 2;
    case AppTabsEnums.FILES_TAB:
      return 3;
    case AppTabsEnums.EMPLOYEES_TAB:
      return 4;
    case AppTabsEnums.CONTACT_MESSAGES_TAB:
      return 5;
    case AppTabsEnums.LOGOUT_TAB:
      return 6;
    default:
      return -1;
  }
}