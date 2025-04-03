import 'package:benek_kulube/data/models/chat_models/chat_model.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';

class ChatDetailButtonWidget extends StatefulWidget {
  final ChatModel chat;
  final IconData icon;
  final double iconSize;
  final bool isLight;
  final Function()? onTap;

  const ChatDetailButtonWidget({
    super.key,
    required this.chat,
    required this.icon,
    this.iconSize = 20.0,
    this.isLight = false,
    this.onTap,
  });

  @override
  State<ChatDetailButtonWidget> createState() => _ChatDetailButtonWidgetState();
}

class _ChatDetailButtonWidgetState extends State<ChatDetailButtonWidget> {
  bool isHovering = false;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onHover: (event) {
          setState(() {
            isHovering = true;
          });
        },
        onExit: (event) {
          setState(() {
            isHovering = false;
          });
        },
        child: Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: isHovering
                  ? AppColors.benekLightBlue
                  : widget.isLight
                      ? AppColors.benekWhite.withOpacity(0.1)
                      : AppColors.benekBlackWithOpacity,
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: Center(
              child: Icon(
                widget.icon,
                size: widget.iconSize,
                color: isHovering
                  ? AppColors.benekBlack
                  : AppColors.benekWhite,
              ),
            )
        ),
      ),
    );
  }
}
