import 'package:benek/redux/is_loading_state/is_loading_state.action.dart';

dynamic isLoadingStateReducer(dynamic state, dynamic action) {
  if (action is IsLoadingStateAction) {
    return action.isLoading;
  }

  return state;
}