import 'package:benek/common/widgets/benek_message_box_widget/benek_message_box_triangle_widget.dart';
import 'package:flutter/material.dart';

import '../../constants/app_colors.dart';

class BenekMessageBoxWidget extends StatefulWidget {

  final Color backgroundColor;
  final Widget? child;
  final double radius;
  final Size size;

  BenekMessageBoxWidget({
    super.key,
    this.child,
    Color? backgroundColor,
    this.radius = 6.0,
    this.size = const Size(600, 250),
  }) : backgroundColor = backgroundColor
            ?? AppColors.benekBlack.withAlpha(51);

  @override
  State<BenekMessageBoxWidget> createState() => _BenekMessageBoxWidgetState();
}

class _BenekMessageBoxWidgetState extends State<BenekMessageBoxWidget> {
  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double maxAllowedWidth = screenWidth * 0.95;

    double containerWidth = widget.size.width > maxAllowedWidth ? maxAllowedWidth : widget.size.width;

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: containerWidth,
          height: widget.size.height,
          // height sabit istiyorsan, yine de ekran yüksekliğini kontrol et
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.6,
          ),
          padding: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: widget.backgroundColor,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(widget.radius),
              topRight: Radius.circular(widget.radius),
              bottomRight: Radius.circular(widget.radius),
            ),
          ),
          child: widget.child ?? const SizedBox(),
        ),
        Triangle(),
      ],
    );
  }
}
