import 'dart:developer';

import 'package:geolocator/geolocator.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

class LocationHelper {
  static Future<void> getCurrentLocation(store) async {
    try {
      bool serviceEnabled;
      LocationPermission permission;

      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        return Future.error('Location services are disabled.');
      }

      permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        bool newPermission = await requestPermission();
        if( newPermission == true ){
          permission = await Geolocator.checkPermission();
        } else if( newPermission == false ){
          return Future.error('Location permissions are denied');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        // Permissions are denied forever, handle appropriately. 
        return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
      }

      // When we reach here, permissions are granted and we can
      // continue accessing the position of the device.
      Position? position = await Geolocator.getLastKnownPosition();
      
      position ??= await Geolocator.getCurrentPosition( desiredAccuracy: LocationAccuracy.high );

      // Set Current Location
      await store.dispatch(SetCurrentLocationAction(position));

    } catch (e) {
      log("Error: getCurrentLocation - $e");
    }
  }

  static Future<bool> requestPermission() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return false;

    final permission = await Geolocator.requestPermission();
    if (permission != LocationPermission.always && permission != LocationPermission.whileInUse) {
      return false;
    }

    int retryCount = 0;
    while (++retryCount <= 5) {
      try {
        await Geolocator.getLastKnownPosition();
        return true;
      } on PermissionDeniedException {
        await Future.delayed(const Duration(microseconds: 250));
        continue;
      }
    }

    return false;
  }
}