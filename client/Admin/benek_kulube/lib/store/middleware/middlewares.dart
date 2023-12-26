import 'package:redux/redux.dart';
import '../app_state.dart';

void exampleMiddleware(
  Store<AppState> store,
  dynamic action,
  NextDispatcher next,
) {
  print('Action: ${action.toString()}');
  next(action);
}