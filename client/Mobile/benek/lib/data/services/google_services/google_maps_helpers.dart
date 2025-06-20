import 'dart:developer';

import 'package:url_launcher/url_launcher.dart';

class GoogleMapsHelpers{
  static Uri getMapLaunchUrl(double latitude, double longitude){
    return Uri.parse('https://maps.google.com/?q=$latitude,$longitude');
  }

  static Future<void> launchMap(double latitude, double longitude) async {
    final Uri url = getMapLaunchUrl(latitude, longitude);

    if( await canLaunchUrl(url) ){
      await launchUrl(url);
    }else{
      log('Could not launch $url');
    }
  }
}