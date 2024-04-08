import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/past_care_givers_preview_widget/past_care_givers_list_element.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/past_care_givers_preview_widget/past_care_givers_loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../data/models/user_profile_models/user_past_care_givers_model.dart';

class PastCareGiverPreviewWidget extends StatelessWidget {
  final String title;
  final String pastCareGiversEmptyStateTitle;
  final List<UserPastCaregivers>? pastCareGiveList;

  const PastCareGiverPreviewWidget({
    Key? key,
    required this.title,
    required this.pastCareGiversEmptyStateTitle,
    this.pastCareGiveList,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      width: 260,
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        color: AppColors.benekBlackWithOpacity,
        borderRadius: const BorderRadius.all(Radius.circular(6.0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 12,
              color: AppColors.benekWhite,
              fontWeight: FontWeight.w400,
            ),
          ),
          const Divider(color: AppColors.benekWhite, thickness: 0.5),
          SizedBox(
            width: double.infinity,
            height: 145,
            child: pastCareGiveList != null
              && pastCareGiveList!.isNotEmpty
              ? ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: pastCareGiveList != null && pastCareGiveList!.length <= 3 ? pastCareGiveList!.length : 3,
                itemBuilder: (context, index) {
                  int itemCount = pastCareGiveList != null && pastCareGiveList!.length <= 3 ? pastCareGiveList!.length : 3;
                  return Column(
                    children: [
                      SizedBox(
                        height: 38,
                        child: pastCareGiveList != null
                            && pastCareGiveList!.isNotEmpty
                            && pastCareGiveList![index].careGiver is String
                            && pastCareGiveList![index].pet is String
                                ? const PastCareGiversLoadingWidget()
                                : PastCareGiversListElement(pastCareGiverInfo: pastCareGiveList![index]),
                      ),
                      if (index < itemCount - 1 )
                        Divider(
                            color: pastCareGiveList != null
                                && pastCareGiveList!.isNotEmpty
                                && pastCareGiveList![index].careGiver is String
                                && pastCareGiveList![index].pet is String
                                  ? AppColors.benekBlack
                                  : AppColors.benekWhite,
                            thickness: 0.5
                        ),
                    ],
                  );
                },
              )
              : Center(
                child: Text(
                  pastCareGiversEmptyStateTitle,
                  style: const TextStyle(
                    color: AppColors.benekWhite,
                    fontFamily: 'Qanelas',
                    fontSize: 15,
                    fontWeight: FontWeight.w200,
                  ),
                ),
              ),
          ),
        ],
      ),
    );
  }
}

