import 'package:benek_kulube/common/constants/app_screens_enum.dart';

class MainObservingStatesViewModel {
  final AppScreenEnums activeScreen;
  final bool isLoading;

  const MainObservingStatesViewModel({
    required this.activeScreen,
    required this.isLoading
  });
}