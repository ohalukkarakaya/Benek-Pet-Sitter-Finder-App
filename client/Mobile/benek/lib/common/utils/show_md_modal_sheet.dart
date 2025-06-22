import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_markdown/flutter_markdown.dart';

Future<void> showMarkdownModalSheet(BuildContext context, String assetPath) async {
  try {
    final content = await rootBundle.loadString(assetPath);

    if (!context.mounted) return;

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
          child: Markdown(
            data: content,
            styleSheet: MarkdownStyleSheet.fromTheme(Theme.of(context)).copyWith(
              p: const TextStyle(color: Colors.white),
              h1: const TextStyle(color: Colors.white, fontSize: 24),
              h2: const TextStyle(color: Colors.white70, fontSize: 20),
              listBullet: const TextStyle(color: Colors.white),
            ),
          ),
        );
      },
    );
  } catch (e) {
    debugPrint("Markdown yüklenemedi: $e");
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Markdown dosyası yüklenemedi')),
    );
  }
}
