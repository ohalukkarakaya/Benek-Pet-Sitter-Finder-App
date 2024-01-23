import 'package:geolocator/geolocator.dart';

class SetCurrentLocationAction {
  final Position currentLocation;
  const SetCurrentLocationAction(this.currentLocation);
}