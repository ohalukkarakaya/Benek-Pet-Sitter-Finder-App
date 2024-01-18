import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../common/constants/tabs_enum.dart';
import 'package:redux/redux.dart';


class TabsButonElementHelper {
  static Function()? getOnTapFunction( Store<AppState> store, AppTabsEnums tab ){
    switch( tab ){
      case AppTabsEnums.HOME_TAB:
        return () async {
          await store.dispatch(ChangeTabAction( tab ) );
        };
      case AppTabsEnums.LOGS_TAB:
        return null;
      case AppTabsEnums.REPORTED_TAB:
        return null;
      case AppTabsEnums.FILES_TAB:
        return null;
      case AppTabsEnums.EMPLOYEES_TAB:
        return null;
      case AppTabsEnums.CONTACT_MESSAGES_TAB:
        return null;
      case AppTabsEnums.LOGOUT_TAB:
        return null;
      default:
        return null;
    }
  }
}