import 'package:flutter/widgets.dart';

import '../../../presentation/shared/components/loading_components/benek_loading_component.dart';
import '../tv_noise.dart';

class VideoLoadingWidget extends StatelessWidget {
  final double width;
  final double height;
  const VideoLoadingWidget({
    super.key,
    this.width = 100.0,
    this.height = 100.0
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: const Stack(
        alignment: Alignment.center,
        children: [
          TvNoise(),
          BenekLoadingComponent(isDark: true),
        ],
      ),
    );
  }
}
