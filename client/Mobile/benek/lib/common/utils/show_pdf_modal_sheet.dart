import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

void showPdfModalSheet(BuildContext context, String assetPath) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.black,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (context) {
      return SizedBox(
        height: MediaQuery.of(context).size.height * 0.85,
        child: SfPdfViewer.asset(assetPath),
      );
    },
  );
}