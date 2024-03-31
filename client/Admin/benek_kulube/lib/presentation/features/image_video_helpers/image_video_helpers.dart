import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ImageVideoHelpers {

  static String mediaServerBaseUrlHelper(){
    return dotenv.env['ENVIRONMENT']! == 'TEST'
        ? dotenv.env['MEDIA_SERVER_TEST_URL']!
        : dotenv.env['MEDIA_SERVER_PROD_URL']! ;
  }

  static bool isImage(String url) {
    return url.contains('.jpg') || url.contains('.jpeg') || url.contains('.png');
  }

  static bool isVideo(String url) {
    return url.contains('.mp4') || url.contains('.mov') || url.contains('.avi');
  }

  static Widget getThumbnail(String url) {
    if (isImage(url)) {
      return Image.network(
        '${ImageVideoHelpers.mediaServerBaseUrlHelper()}getAsset?assetPath=${url}',
        headers: { "private-key": dotenv.env['MEDIA_SERVER_API_KEY']! },
        fit: BoxFit.cover,
      );
    } else if (isVideo(url)) {
      try{
        return Image.network(
          '${ImageVideoHelpers.mediaServerBaseUrlHelper()}getVideoThumbnail?videoPath=${url}',
            headers: { "private-key": dotenv.env['MEDIA_SERVER_API_KEY']! },
            fit: BoxFit.cover,
        );
      } catch (e) {
        log('ERROR: getThumbnail - $e');
        return const SizedBox();
      }
    } else {
      return const SizedBox();
    }
  }

}