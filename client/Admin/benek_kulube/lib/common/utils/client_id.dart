import 'dart:convert';
import 'dart:typed_data';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';

String generateRandomString(int length) {
  final random = Random.secure();
  final values = List<int>.generate(length, (index) => random.nextInt(256));
  return base64Url.encode(Uint8List.fromList(values));
}

Future<String> getClientId() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? clientId = prefs.getString('clientId');
  
  if (clientId == null) {
    // If clientId doesn't exist, generate a new one and save it to SharedPreferences
    clientId = generateRandomString(50);
    prefs.setString('clientId', clientId);
  }
  
  return clientId;
}