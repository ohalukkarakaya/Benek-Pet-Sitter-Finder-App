import 'dart:developer';

import 'package:flutter/material.dart';


class BenekDefaultAvatar extends StatelessWidget {
  final String backgroundImagePath;
  final String avatarImagePath;
  final double width;
  final double height;
  final double borderRadius;
  final bool isPet;

  const BenekDefaultAvatar(
    {
    super.key, 
    required this.backgroundImagePath,
    required this.avatarImagePath,
    required this.width,
    required this.height,
    required this.borderRadius,
    this.isPet = false
    }
  );

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // .jpg uzantılı asset
          Image.asset(
            backgroundImagePath,
            width: width,
            height: height,
            fit: BoxFit.cover,
          ),

          // .png uzantılı asset
          Positioned(
            bottom: 0,
            child: Image.asset(
              avatarImagePath,
              width: isPet ? width - 5 : width,
              height: isPet ? height - 5 : height,
              fit: BoxFit.cover,
              errorBuilder: (BuildContext context, Object error, StackTrace? stackTrace) {
                if(error != null){
                  log('Error: $error');
                }
                return const SizedBox();
              }
            ),
          ),
        ],
      ),
    );
  }
}
