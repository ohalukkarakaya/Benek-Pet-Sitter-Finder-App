import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import 'edit_bio_button.dart';

class EditedBioRow extends StatelessWidget {
  final String bio;
  const EditedBioRow({
    super.key,
    required this.bio,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Stack(
          children: [
            Container(
              width: 680,
              decoration: const BoxDecoration(
                color: AppColors.benekBlack,
                borderRadius: BorderRadius.all(Radius.circular(6.0)),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 35.0),
                child: Center(
                  child: Wrap(
                    children: [
                      Text(
                        bio,
                        textAlign: TextAlign.center,
                        style: planeTextWithoutWeightStyle(
                          textColor: AppColors.benekWhite,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const Positioned(
              top: 0,
              left: 0,
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(6.0),
                ),
                child: EditBioButton(),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
