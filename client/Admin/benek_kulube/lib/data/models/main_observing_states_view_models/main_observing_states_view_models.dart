import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:redux/redux.dart';

class MainObservingStatesViewModel {
  final Store<AppState> store;
  final AppScreenEnums activeScreen;
  final bool isLoading;

  const MainObservingStatesViewModel({
    required this.store,
    required this.activeScreen,
    required this.isLoading
  });
}