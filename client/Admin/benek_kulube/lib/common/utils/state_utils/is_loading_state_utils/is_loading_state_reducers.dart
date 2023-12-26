import 'package:benek_kulube/common/utils/state_utils/is_loading_utils/is_loading_state_actions.dart';

dynamic isLoadingStateReducer(dynamic state, dynamic action) {
  if (action is IsLoadingStateAction) {
    return state.copyWith(isLoading: action.isLoading);
  }

  return state;
}