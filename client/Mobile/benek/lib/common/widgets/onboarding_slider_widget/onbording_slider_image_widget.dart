import 'package:flutter/material.dart';

class OnBoardingSliderImageWidget extends StatelessWidget {
  final double height;
  final PageController controller;
  final ValueChanged<int> onPageChanged;

  const OnBoardingSliderImageWidget({
    super.key,
    this.height = 300,
    required this.controller,
    required this.onPageChanged,
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return SizedBox(
      height: height,
      width: screenWidth,
      child: PageView.builder(
        controller: controller,
        itemCount: 2,
        scrollDirection: Axis.horizontal,
        physics: const NeverScrollableScrollPhysics(),
        onPageChanged: onPageChanged, // 💡 sayfa değişince bildir
        itemBuilder: (context, index) {
          return ClipRRect(
            child: Stack(
              children: [
                Positioned.fill(
                  child: FractionallySizedBox(
                    widthFactor: 2,
                    alignment: Alignment.centerLeft,
                    child: Transform.translate(
                      offset: Offset(-index * screenWidth, 0),
                      child: Image.asset(
                        'assets/images/benek_slider_image.png',
                        width: screenWidth * 2,
                        height: height,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
