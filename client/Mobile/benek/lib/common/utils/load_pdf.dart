import 'package:flutter/services.dart' show rootBundle;
import 'dart:io';
import 'package:path_provider/path_provider.dart';

Future<File> loadPDF(String filename) async {
  final byteData = await rootBundle.load(filename);
  final file = File('${(await getTemporaryDirectory()).path}/$filename');
  await file.writeAsBytes(byteData.buffer.asUint8List());
  return file;
}