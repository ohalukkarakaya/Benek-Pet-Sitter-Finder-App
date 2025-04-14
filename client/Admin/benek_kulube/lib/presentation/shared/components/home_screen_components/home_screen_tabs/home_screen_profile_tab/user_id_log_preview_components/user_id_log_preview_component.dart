import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/user_id_log_preview_components/see_user_logs_detailed_button.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/user_id_log_preview_components/user_id_log_preview_empty_state.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/user_id_log_preview_components/user_id_log_preview_loading_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/user_id_log_preview_components/user_id_log_preview_widget.dart';
import 'package:flutter/material.dart';

import '../../../../../../../data/models/log_models/log_model.dart';

class UserIdLogPreviewComponent extends StatelessWidget {
  final double height;
  final double width;
  final bool isLoading;
  final List<LogModel>? logData;

  const UserIdLogPreviewComponent({
    super.key,
    this.height = 350,
    this.width = 350,
    this.isLoading = true,
    required this.logData
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        isLoading
        && (
          logData == null
          || ( logData != null && logData!.isEmpty )
        )
          ? const UserIdLogPreviewLoadingWidget()
          : !isLoading
            && logData != null
            && logData!.isNotEmpty
              ? UserIdLogPreviewWidget(
                height: height,
                width: width,
                logData: logData!
              )
              : UserIdLogPreviewEmptyStateWidget(
                height: height,
                width: width
              ),

         const SizedBox(height: 30.0),

        // SizedBox(
        //     height: !isLoading && logData != null && logData!.isNotEmpty
        //           ? 20.0
        //           : 0.0
        // ),
        //
        // !isLoading && logData != null && logData!.isNotEmpty
        //   ? const SeeUserLogsDetailedButton()
        //   : const SizedBox()
      ],
    );
  }
}
