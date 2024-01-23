import 'dart:async';

import 'package:flutter/material.dart';

import 'package:flutter_svg/flutter_svg.dart';
import '../../../../common/utils/color_to_hex_converter.dart';
import 'benek_process_indicator_steps.dart';

class BenekProcessIndicator extends StatefulWidget {
  final Color color;
  final double? width;
  final double? height;

  const BenekProcessIndicator({
    Key? key,
    this.color = Colors.white,
    this.width = 30,
    this.height = 30,
  }) : super(key: key);

  @override
  State<BenekProcessIndicator> createState() => _BenekProcessIndicatorState();
}

class _BenekProcessIndicatorState extends State<BenekProcessIndicator> {
  int currentState = 0;
  bool isAnimationReversed = false;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      setState(() {
        if (currentState < 22 && !isAnimationReversed) {
          currentState = currentState + 1;
        } else {
          isAnimationReversed = true;
          currentState = currentState - 1;
          if (currentState < 0) {
            currentState = 0;
            isAnimationReversed = false;
          }
        }
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    String svg = '<svg viewBox="${ processIndicatorSteps[currentState].viewBox }"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="${ processIndicatorSteps[currentState].path }" style="fill:#${widget.color.toHex(withAlpha: false)}"/></g></g></svg>';
    // log(svg);
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: SvgPicture.string(
            svg,
            height: widget.height,
            width: widget.width,
          ),
    );
  }
}
