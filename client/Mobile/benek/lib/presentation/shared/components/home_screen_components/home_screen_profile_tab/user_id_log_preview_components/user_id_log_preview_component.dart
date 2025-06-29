import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/user_id_log_preview_components/user_id_log_preview_empty_state.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/user_id_log_preview_components/user_id_log_preview_loading_widget.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/user_id_log_preview_components/user_id_log_preview_widget.dart';
import 'package:flutter/material.dart';

import '../../../../../../../data/models/log_models/log_model.dart';

class UserIdLogPreviewComponent extends StatelessWidget {
  final double height;
  final double width;
  final bool isLoading;
  final List<LogModel>? logData;
  final bool shouldGivePaddingToBottom;

  const UserIdLogPreviewComponent({
    super.key,
    this.height = 350,
    this.width = 350,
    this.isLoading = true,
    required this.logData,
    this.shouldGivePaddingToBottom = true
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
          ? UserIdLogPreviewLoadingWidget(
           height: height,
            width: width,
            shouldGivePaddingToBottom: shouldGivePaddingToBottom
          )
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
                width: width,
                shouldGivePaddingToBottom: shouldGivePaddingToBottom
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
