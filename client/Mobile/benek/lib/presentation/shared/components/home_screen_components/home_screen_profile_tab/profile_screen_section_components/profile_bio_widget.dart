import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/widgets.dart';
import '../../../../../../../common/constants/app_colors.dart';

class ProfileBioWidget extends StatelessWidget {
  final String text;
  const ProfileBioWidget({
    super.key,
    required this.text
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    final containerWidth = screenWidth < 600 ? screenWidth : 540.0;

    return Padding(
      padding: const EdgeInsets.only(top: 20.0),
      child: Container(
        width: containerWidth,
        padding: const EdgeInsets.all(20.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlack.withAlpha((0.2 * 255).toInt()),
          borderRadius: const BorderRadius.all(Radius.circular(6.0)),
        ),
        child: Center(
          child: Wrap(
            children: [
              Text(
                text,
                textAlign: TextAlign.center,
                style: planeTextWithoutWeightStyle(textColor: AppColors.benekWhite),
              )
            ],
          ),
        ),
      ),
    );
  }
}