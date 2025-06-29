import 'dart:math';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../data/models/chat_models/chat_model.dart';

class ChatLoadingList extends StatelessWidget {
  final ChatModel chat;

  const ChatLoadingList({super.key, required this.chat});

  @override
  Widget build(BuildContext context) {
    int shimmerCount = 0;

    if (chat.totalMessageCount != null) {
      shimmerCount = chat.totalMessageCount! >= 15 ? 15 : chat.totalMessageCount!;
    }

    final random = Random();
    String? lastAvatarSide;
    String? previousAvatarSide;

    return ScrollConfiguration(
      behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
      child: ListView.builder(
        reverse: true,
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
        physics: const NeverScrollableScrollPhysics(),
        itemCount: shimmerCount + 1, // +1: en alta boşluk eklemek için
        itemBuilder: (context, index) {
          // 🟢 Ekstra boşluk en alta koyulacak
          if (index == shimmerCount) {
            return const SizedBox(height: 16); // en alttaki "yapışma" boşluğu
          }

          bool showAvatar = random.nextBool();
          bool avatarLeft = random.nextBool();

          if (index == 0) {
            showAvatar = true;
          }

          if (showAvatar && previousAvatarSide != null) {
            avatarLeft = previousAvatarSide == 'left' ? false : true;
          }

          if (showAvatar) {
            previousAvatarSide = avatarLeft ? 'left' : 'right';
          }

          double randomwidth = MediaQuery.of(context).size.width * (0.1 + random.nextDouble() * 0.2);


          double bubbleWidth = randomwidth <= MediaQuery.of(context).size.width - 690
            ? randomwidth
            : MediaQuery.of(context).size.width - 690;
          int bubbleHeight = 40 + random.nextInt(40);

          Widget avatar = Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              shape: BoxShape.circle,
            ),
          );

          Widget bubble = Container(
            width: bubbleWidth,
            height: bubbleHeight.toDouble(),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(12),
            ),
          );

          List<Widget> children;

          if (showAvatar) {
            lastAvatarSide = avatarLeft ? 'left' : 'right';
            children = avatarLeft
                ? [avatar, const SizedBox(width: 10), bubble]
                : [bubble, const SizedBox(width: 10), avatar];
          } else {
            Widget space = const SizedBox(width: 40);
            if (lastAvatarSide == 'left') {
              children = [space, const SizedBox(width: 10), bubble];
            } else if (lastAvatarSide == 'right') {
              children = [bubble, const SizedBox(width: 10), space];
            } else {
              children = [bubble];
            }
          }

          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Shimmer.fromColors(
              baseColor: AppColors.benekGrey.withOpacity(0.4),
              highlightColor: AppColors.benekWhite.withOpacity(0.2),
              child: Align(
                alignment: lastAvatarSide == 'left'
                    ? Alignment.centerLeft
                    : lastAvatarSide == 'right'
                      ? Alignment.centerRight
                      : Alignment.centerLeft,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: children,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}