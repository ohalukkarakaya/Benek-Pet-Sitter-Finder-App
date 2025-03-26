import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/past_care_givers_preview_widget/past_care_givers_detail_element.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/past_care_givers_preview_widget/past_care_givers_detail_loading_element.dart';

import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../loading_components/benek_blured_modal_barier.dart';
import 'care_give_detail_element.dart';

class CareGiveDetailWidget extends StatefulWidget {
  const CareGiveDetailWidget({super.key});

  @override
  State<CareGiveDetailWidget> createState() => _CareGiveDetailWidgetState();
}

class _CareGiveDetailWidgetState extends State<CareGiveDetailWidget> {
  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = StoreProvider.of<AppState>(context);
    final UserInfo userInfo = store.state.selectedUserInfo!;

    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () => Navigator.of(context).pop(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Padding(
          padding:const EdgeInsets.only(top: 20.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 100.0),
                  child: Material(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      width: 600,
                      padding: const EdgeInsets.only(right: 24, left: 24),
                      child: ScrollConfiguration(
                        behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                        child: SingleChildScrollView(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 25.0),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Container(
                                  decoration: BoxDecoration(
                                    color:  AppColors.benekBlack.withOpacity(0.6),
                                    borderRadius: BorderRadius.circular(6.0),
                                  ),
                                  padding: const EdgeInsets.only(top: 20.0, left: 20.0, right: 20.0),
                                  child: Column(
                                    children: List.generate(
                                        userInfo.caregiverCareer != null
                                            ? userInfo.caregiverCareer!.length
                                            : 0,
                                            (index) => Padding(
                                            padding: EdgeInsets.only(bottom: 30.0),
                                            child: userInfo.caregiverCareer != null
                                                && userInfo.caregiverCareer!.isNotEmpty
                                                && userInfo.caregiverCareer![index].pet is String

                                                ? const PastCareGiversDetailLoadingElement()
                                                : CareGiveDetailElement(
                                                    careGiveInfo: userInfo.caregiverCareer![index],
                                                  )
                                        )
                                    ),
                                  ),
                                )
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  )
              ),
            ],
          ),
        ),
      ),
    );
  }
}
