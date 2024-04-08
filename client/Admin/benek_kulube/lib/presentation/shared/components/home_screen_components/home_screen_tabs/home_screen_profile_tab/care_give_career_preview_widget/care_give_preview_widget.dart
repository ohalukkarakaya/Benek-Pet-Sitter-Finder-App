import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_care_giver_career_model.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/care_give_career_preview_widget/care_give_list_element.dart';
import 'package:flutter/material.dart';

import 'care_give_loading_widget.dart';

class CareGivePreviewWidget extends StatelessWidget {
  final String title;
  final String emptyStateTitle;
  final List<UserCaregiverCareer>? careGiveList;

  const CareGivePreviewWidget({
    Key? key,
    required this.title,
    required this.emptyStateTitle,
    this.careGiveList,
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
            child: careGiveList != null
              && careGiveList!.isNotEmpty
              ? ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: careGiveList != null && careGiveList!.length <= 3 ? careGiveList!.length : 3,
                itemBuilder: (context, index) {
                  int itemCount = careGiveList != null && careGiveList!.length <= 3 ? careGiveList!.length : 3;
                  return Column(
                    children: [
                      SizedBox(
                        height: 38,
                        child: careGiveList != null
                            && careGiveList!.isNotEmpty
                            && careGiveList![index].pet is String
                                ? const CareGiveLoadingWidget()
                                : CareGiveListElement(careGiveInfo: careGiveList![index]),
                      ),
                      if (index < itemCount - 1 )
                        Divider(
                            color: careGiveList != null
                                && careGiveList!.isNotEmpty
                                && careGiveList![index].pet is String
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
                  emptyStateTitle,
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

