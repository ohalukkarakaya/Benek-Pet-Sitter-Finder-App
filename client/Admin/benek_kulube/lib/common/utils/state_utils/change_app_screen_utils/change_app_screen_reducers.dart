import 'change_app_screen_actions.dart';

dynamic changeAppScreenReducer(dynamic state, dynamic action) async {
  if (action is ChangeScreenAction) {
    return state.copyWith(activeScreen: action.newScreen);
  }

  return state;
} 