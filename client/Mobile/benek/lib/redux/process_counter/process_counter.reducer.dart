import '../../store/actions/app_actions.dart';

int processCounterReducer( int processCounter, dynamic action ){
  if( action is IncreaseProcessCounterAction ){
    return processCounter + 1;
  }else if( action is DecreaseProcessCounterAction ){
    int newValue = processCounter - 1;
    return newValue < 0 ? 0 : newValue;
  }

  return processCounter;
}