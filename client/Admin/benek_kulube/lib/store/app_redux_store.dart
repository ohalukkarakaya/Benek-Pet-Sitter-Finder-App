import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/store/reducers/app_reducers.dart';
import 'package:redux/redux.dart';
import 'package:redux_thunk/redux_thunk.dart';

class AppReduxStore {
  static Store<AppState>? currentStore;

  static Store<AppState> getInitialStore() {
    return Store<AppState>(
      appReducer,
      initialState: AppState.initial(),
      middleware: [
        thunkMiddleware,
      ],
    );
  }
}