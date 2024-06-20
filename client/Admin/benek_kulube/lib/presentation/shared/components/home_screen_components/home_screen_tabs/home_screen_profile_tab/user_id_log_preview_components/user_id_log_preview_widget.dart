import 'package:benek_kulube/data/models/log_models/log_model.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';

class UserIdLogPreviewWidget extends StatelessWidget {
  final double height;
  final double width;
  final LogModel logData;

  const UserIdLogPreviewWidget({
    super.key,
    this.height = 350,
    this.width = 350,
    required this.logData
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only( top: 20.0, right: 40.0),
      child: Container(
        width: width,
        padding: const EdgeInsets.all(10.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlackWithOpacity,
          borderRadius: BorderRadius.circular(10.0),
        ),


      ),
    );
  }
}
