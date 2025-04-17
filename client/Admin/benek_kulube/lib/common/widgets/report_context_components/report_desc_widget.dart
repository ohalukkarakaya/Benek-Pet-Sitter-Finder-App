import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../constants/app_colors.dart';
import '../../utils/benek_string_helpers.dart';
import '../../utils/benek_toast_helper.dart';
import '../text_with_profile_img.dart';

class ReportDescWidget extends StatelessWidget {
  final String reportDesc;
  final UserInfo reportOwner;

  const ReportDescWidget({
    super.key,
    required this.reportDesc,
    required this.reportOwner,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onLongPress: () {
        Clipboard.setData(ClipboardData(text: reportDesc));
        BenekToastHelper.showSuccessToast(
            BenekStringHelpers.locale('operationSucceeded'),
            BenekStringHelpers.locale('copied'),
            context
        );
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.all(Radius.circular(6.0)),
          border: Border.all(
            color: AppColors.benekWarningOrange,
            width: 1.0,
          ),
        ),
        child: TextWithProfileImg(
            text: reportDesc,
            profileImg: reportOwner.profileImg!
        ),
      ),
    );
  }
}
