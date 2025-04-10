import 'package:benek_kulube/presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class FileMassageDialog extends StatelessWidget {
  final String filePath;
  final bool shouldDisplayAtLeft;

  const FileMassageDialog({
    super.key,
    required this.filePath,
    this.shouldDisplayAtLeft = true,
  });

  @override
  Widget build(BuildContext context) {
    String fullFilePath = ImageVideoHelpers.getFullUrl(filePath);
    final maxBubbleWidth = MediaQuery.of(context).size.width * 0.7;

    return Align(
      alignment: shouldDisplayAtLeft
          ? Alignment.centerLeft
          : Alignment.centerRight,
      child: Container(
        width: maxBubbleWidth / 2,
        height: maxBubbleWidth / 2,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        margin: const EdgeInsets.symmetric(vertical: 4),
        decoration: BoxDecoration(
            color: Colors.blueAccent,
            borderRadius: BorderRadius.circular( 6.0 ),
            image: DecorationImage(
              image: NetworkImage(
                fullFilePath,
                headers: { "private-key": dotenv.env['MEDIA_SERVER_API_KEY']! },
              ),
              fit: BoxFit.cover,
            )
        ),
      ),
    );
  }
}
