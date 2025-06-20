import '../../store/actions/app_actions.dart';

dynamic setDeviceLanguageReducer(dynamic state, dynamic action) {
  if (action is SetDeviceLanguageAction) {
    return action.language;
  }

  return state;
}