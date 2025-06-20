import 'package:benek/common/constants/tabs_enum.dart';
import 'package:benek/redux/change_screen_tab/change_screen_tab.action.dart';

AppTabsEnums changeTabReducer(dynamic state, dynamic action) {
  if (action is ChangeTabAction) {
    return action.newTab;
  }

  return state;
} 