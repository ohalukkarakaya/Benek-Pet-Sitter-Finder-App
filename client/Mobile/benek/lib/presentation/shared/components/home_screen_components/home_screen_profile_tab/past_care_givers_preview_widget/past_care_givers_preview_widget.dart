import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/past_care_givers_preview_widget/past_care_givers_list_element.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/past_care_givers_preview_widget/past_care_givers_loading_widget.dart';
import 'package:flutter/material.dart';

import '../../../../../../../data/models/user_profile_models/user_past_care_givers_model.dart';
import 'benek_profile_past_caregivers_detail_widget.dart';

class PastCareGiverPreviewWidget extends StatefulWidget {
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
  State<PastCareGiverPreviewWidget> createState() => _PastCareGiverPreviewWidgetState();
}

class _PastCareGiverPreviewWidgetState extends State<PastCareGiverPreviewWidget> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final containerWidth = screenWidth < 600 ? screenWidth * 0.5 : 260.0;

    return GestureDetector(
      onTap: () {
        if (widget.pastCareGiveList == null || widget.pastCareGiveList!.isEmpty) {
          return;
        }

        Navigator.push(
          context,
          PageRouteBuilder(
            opaque: false,
            barrierDismissible: true,
            pageBuilder: (context, _, __) => const PastCaregiversDetailWidget(),
          ),
        );
      },
      child: Stack(
        children: [
          Container(
            height: 200,
            width: containerWidth,
            padding: const EdgeInsets.all(10.0),
            decoration: BoxDecoration(
              color: isHovering ? AppColors.benekBlack.withAlpha((0.5 * 255).toInt()) : AppColors.benekBlackWithOpacity,
              borderRadius: const BorderRadius.all(Radius.circular(6.0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.title,
                  style: regularTextStyle(textColor: AppColors.benekWhite),
                ),
                const Divider(color: AppColors.benekWhite, thickness: 0.5),
                SizedBox(
                  width: double.infinity,
                  height: 145,
                  child: widget.pastCareGiveList != null && widget.pastCareGiveList!.isNotEmpty
                      ? ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: widget.pastCareGiveList!.length <= 3 ? widget.pastCareGiveList!.length : 3,
                          itemBuilder: (context, index) {
                            int itemCount = widget.pastCareGiveList!.length <= 3 ? widget.pastCareGiveList!.length : 3;
                            return Column(
                              children: [
                                SizedBox(
                                  height: 38,
                                  child: widget.pastCareGiveList![index].careGiver is String || widget.pastCareGiveList![index].pet is String
                                      ? const PastCareGiversLoadingWidget()
                                      : PastCareGiversListElement(pastCareGiverInfo: widget.pastCareGiveList![index]),
                                ),
                                if (index < itemCount - 1)
                                  Divider(
                                    color: widget.pastCareGiveList![index].careGiver is String && widget.pastCareGiveList![index].pet is String
                                        ? AppColors.benekBlack
                                        : AppColors.benekWhite,
                                    thickness: 0.5,
                                  ),
                              ],
                            );
                          },
                        )
                      : Center(
                          child: Text(
                            widget.pastCareGiversEmptyStateTitle,
                            style: thinTextStyle(
                              textColor: AppColors.benekWhite,
                              textFontSize: 15,
                            ),
                          ),
                        ),
                ),
              ],
            ),
          ),
          widget.pastCareGiveList != null && widget.pastCareGiveList!.isNotEmpty
              ? Positioned(
                  bottom: 0,
                  child: Container(
                    width: containerWidth,
                    height: 75,
                    decoration: BoxDecoration(
                      color: AppColors.benekWhite,
                      borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(6.0),
                        bottomRight: Radius.circular(6.0),
                      ),
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [
                          AppColors.benekBlack.withAlpha((0.8 * 255).toInt()),
                          AppColors.benekBlack.withAlpha((0.0 * 255).toInt()),
                        ],
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.only(top: 30.0),
                      child: Center(
                        child: Text(
                          BenekStringHelpers.locale('seeDetails'),
                          style: TextStyle(
                            color: AppColors.benekWhite,
                            fontFamily: defaultFontFamily(),
                            fontSize: 12,
                            fontWeight: isHovering ? getFontWeight('semiBold') : getFontWeight('regular'),
                          ),
                        ),
                      ),
                    ),
                  ),
                )
              : const SizedBox(),
        ],
      ),
    );
  }
}