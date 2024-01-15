import '../../../constants/app_screens_enum.dart';
import 'change_app_screen_actions.dart';

AppScreenEnums changeAppScreenReducer(dynamic state, dynamic action) {
  if (action is ChangeScreenAction) {
    return action.newScreen;
  }

  return state.activeScreen;
} 