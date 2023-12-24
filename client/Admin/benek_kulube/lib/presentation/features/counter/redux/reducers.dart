import './actions.dart';

int counterReducer(int state, dynamic action) {
  if (action is IncrementCounterAction) {
    return state + 1;
  } else if (action is DecrementCounterAction) {
    return state - 1;
  }
  return state;
}