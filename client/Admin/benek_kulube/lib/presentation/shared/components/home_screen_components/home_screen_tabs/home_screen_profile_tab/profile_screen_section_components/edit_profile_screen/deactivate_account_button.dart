import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../common/widgets/slide_to_act.dart';

class DeactivateAccountButton extends StatefulWidget {
  const DeactivateAccountButton({super.key});

  @override
  State<DeactivateAccountButton> createState() => _DeactivateAccountButtonState();
}

class _DeactivateAccountButtonState extends State<DeactivateAccountButton> {
  bool didApprove = false;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 275,
      height: 65,
      child: Builder(
        builder: (context) {
          return SlideAction(
            sliderButtonIconSize: 15,
            sliderButtonIconPadding: 15,
            text: BenekStringHelpers.locale('deactivateAccount'),
            borderRadius: 6.0,
            textStyle: regularTextStyle(
              textColor: AppColors.benekRed,
              textFontSize: 9.0,
            ),
            onSubmit: () async {
              setState(() {
                didApprove = true;
              });
              Navigator.of(context).pop(didApprove);
            },
            innerColor: AppColors.benekRed,
            outerColor: AppColors.benekLightRed,
            submittedIcon: const Icon(
              Icons.done,
              color: AppColors.benekRed,
              size: 20,
            ),
            sliderButtonYOffset: 5,
          );
        },
      ),
    );
  }
}
