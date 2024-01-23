import 'package:benek_kulube/redux/set_current_location/set_current_location.action.dart';

dynamic setCurrentLocationReducer(dynamic state, dynamic action) {
  if (action is SetCurrentLocationAction) {
    return action.currentLocation;
  }

  return state;
}