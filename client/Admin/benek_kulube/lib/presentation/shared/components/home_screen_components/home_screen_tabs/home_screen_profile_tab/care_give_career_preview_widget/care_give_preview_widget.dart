import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_care_giver_career_model.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/care_give_career_preview_widget/care_give_list_element.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/utils/benek_string_helpers.dart';
import 'care_give_loading_widget.dart';

class CareGivePreviewWidget extends StatefulWidget {
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
  State<CareGivePreviewWidget> createState() => _CareGivePreviewWidgetState();
}

class _CareGivePreviewWidgetState extends State<CareGivePreviewWidget> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (event) {
        if( widget.careGiveList != null && widget.careGiveList!.isNotEmpty ){
          setState(() {
            isHovering = true;
          });
        }
      },
      onExit: (event) {
        setState(() {
          isHovering = false;
        });
      },
      child: Stack(
        children: [
          Container(
            height: 200,
            width: 260,
            padding: const EdgeInsets.all(10.0),
            decoration: BoxDecoration(
              color: isHovering ? AppColors.benekBlack.withOpacity(0.5) : AppColors.benekBlackWithOpacity,
              borderRadius: const BorderRadius.all(Radius.circular(6.0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.title,
                  style: regularTextStyle( textColor: AppColors.benekWhite ),
                ),
                const Divider(color: AppColors.benekWhite, thickness: 0.5),
                SizedBox(
                  width: double.infinity,
                  height: 145,
                  child: widget.careGiveList != null
                    && widget.careGiveList!.isNotEmpty
                    ? ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: widget.careGiveList != null && widget.careGiveList!.length <= 3 ? widget.careGiveList!.length : 3,
                      itemBuilder: (context, index) {
                        int itemCount = widget.careGiveList != null && widget.careGiveList!.length <= 3 ? widget.careGiveList!.length : 3;
                        return Column(
                          children: [
                            SizedBox(
                              height: 38,
                              child: widget.careGiveList != null
                                  && widget.careGiveList!.isNotEmpty
                                  && widget.careGiveList![index].pet is String
                                      ? const CareGiveLoadingWidget()
                                      : CareGiveListElement(careGiveInfo: widget.careGiveList![index]),
                            ),
                            if (index < itemCount - 1 )
                              Divider(
                                  color: widget.careGiveList != null
                                      && widget.careGiveList!.isNotEmpty
                                      && widget.careGiveList![index].pet is String
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
                        widget.emptyStateTitle,
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

          widget.careGiveList != null && widget.careGiveList!.isNotEmpty
            ? Positioned(
              bottom: 0,
              child: Container(
                  width: 260,
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
                        AppColors.benekBlack.withOpacity(0.8),
                        AppColors.benekBlack.withOpacity(0.0),
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
                  )
              ),
            )
            : const SizedBox(),
        ],
      ),
    );
  }
}

