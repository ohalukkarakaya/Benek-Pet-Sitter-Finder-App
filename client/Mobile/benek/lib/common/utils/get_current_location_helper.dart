import 'dart:async';
import 'dart:developer';

import 'package:flutter/services.dart';
import 'package:geolocator/geolocator.dart';
import 'package:benek/store/actions/app_actions.dart';

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

      if (position == null) {
        try {
          position = await Geolocator.getCurrentPosition(
            desiredAccuracy: LocationAccuracy.lowest,
            forceAndroidLocationManager: true,
            timeLimit: const Duration(seconds: 5),
          );
        } on TimeoutException catch (e) {
          log("TimeoutException: ${e.message}");
          position = Position(
              longitude:  store.state.userInfo!.location != null ? store.state.userInfo!.location.lng : 30.704044,
              latitude: store.state.userInfo!.location != null ? store.state.userInfo!.location.lat : 36.884804,
              timestamp: DateTime.now(),
              accuracy: 0.0,
              altitude: 0.0,
              altitudeAccuracy: 0.0,
              heading: 0.0,
              headingAccuracy: 0.0,
              speed: 0.0,
              speedAccuracy: 0.0
          );
        }
      }

      log("Current Location: ${position.latitude}, ${position.longitude}");

      // Set Current Location
      await store.dispatch(SetCurrentLocationAction(position));

    } on PlatformException catch (e) {
      log("PlatformException: ${e.message}");
      if (e.details != null) {
        log("PlatformException details: ${e.details}");
      }

      return Future.error("Couldn't get location data}");
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