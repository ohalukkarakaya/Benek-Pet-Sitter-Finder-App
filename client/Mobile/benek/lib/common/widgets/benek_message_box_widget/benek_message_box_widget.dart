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
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: widget.size.width,
          height: widget.size.height,
          padding: const EdgeInsets.all( 8.0 ),
          decoration: BoxDecoration(
            color: widget.backgroundColor,
            borderRadius: BorderRadius.only(
                topLeft: Radius.circular( widget.radius ),
                topRight: Radius.circular( widget.radius ),
                bottomRight: Radius.circular( widget.radius ),
            ),
          ),
          child: widget.child != null
                  ? widget.child!
                  : const SizedBox(),
        ),

        Triangle()
      ],
    );
  }
}
