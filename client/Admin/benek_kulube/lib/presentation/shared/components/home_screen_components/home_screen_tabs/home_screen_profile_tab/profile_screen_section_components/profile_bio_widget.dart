import 'package:benek_kulube/common/utils/styles.text.dart';
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
    return Padding(
      padding: const EdgeInsets.only( top: 20.0),
      child: Container(
        width: 540,
        padding: const EdgeInsets.all(20.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlack.withOpacity(0.2),
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        child: Center(
          child: Wrap(
            children: [
              Text(
                text,
                textAlign: TextAlign.center,
                style: planeTextWithoutWeightStyle( textColor: AppColors.benekWhite ),
              )
            ]
          ),
        ),
      ),
    );
  }
}
