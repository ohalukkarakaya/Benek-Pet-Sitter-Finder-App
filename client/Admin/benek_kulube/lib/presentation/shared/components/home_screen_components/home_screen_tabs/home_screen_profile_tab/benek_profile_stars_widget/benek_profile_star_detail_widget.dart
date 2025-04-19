import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../loading_components/benek_blured_modal_barier.dart';
import 'benek_profile_star_detail_info_card.dart';
import 'benek_profile_star_detail_star_data_card.dart';

class BenekProfileStarDetailWidget extends StatefulWidget {
  const BenekProfileStarDetailWidget({super.key});

  @override
  State<BenekProfileStarDetailWidget> createState() => _BenekProfileStarDetailWidgetState();
}

class _BenekProfileStarDetailWidgetState extends State<BenekProfileStarDetailWidget> {

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
          padding: const EdgeInsets.only(top: 20.0),
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
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  BenekProfileStarDetailInfoCard(
                                    icon: BenekIcons.star,
                                    title: BenekStringHelpers.locale('averageRating'),
                                    value: userInfo.starAverage.toString(),
                                  ),

                                  BenekProfileStarDetailInfoCard(
                                    icon: BenekIcons.mailseen,
                                    title: BenekStringHelpers.locale('totalVote'),
                                    value: userInfo.stars!.length.toString(),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 20),

                              Container(
                                decoration: BoxDecoration(
                                  color:  AppColors.benekBlack.withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(6.0),
                                ),
                                padding: const EdgeInsets.only(top: 20.0, left: 20.0, right: 20.0),
                                child: Column(
                                  children: List.generate(
                                      userInfo.stars!.length,
                                      (index) => Padding(
                                        padding: EdgeInsets.only(bottom: 25.0),
                                        child: BenekProfileStarDetailStarDataCard(
                                          starData: userInfo.stars![index],
                                        ),
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
        )
      )
    );
  }
}
