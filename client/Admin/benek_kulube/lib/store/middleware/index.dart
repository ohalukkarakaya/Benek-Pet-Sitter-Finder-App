import 'package:redux/redux.dart';
import '../store.dart';

void exampleMiddleware(
  Store<AppState> store,
  dynamic action,
  NextDispatcher next,
) {
  print('Action: ${action.toString()}');
  next(action);
}