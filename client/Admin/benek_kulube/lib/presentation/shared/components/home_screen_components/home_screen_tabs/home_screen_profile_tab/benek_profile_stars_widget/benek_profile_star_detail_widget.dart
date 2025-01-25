import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/past_care_givers_preview_widget/past_care_givers_loading_widget.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../store/actions/app_actions.dart';

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

  bool didRequestSend = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Store<AppState> store = StoreProvider.of<AppState>(context);

      if( !didRequestSend ){
        await store.dispatch(IncreaseProcessCounterAction());
        didRequestSend = true;

        await store.dispatch(getSelectedUserStarDataAction( store.state.selectedUserInfo?.userId ));
      }

      await store.dispatch(DecreaseProcessCounterAction());
    });
  }

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
                    padding: const EdgeInsets.all(24),
                    child: SingleChildScrollView(
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
                                value: userInfo.totalStar.toString(),
                              ),
                            ],
                          ),

                          const SizedBox(height: 20),

                          Column(
                            children: List.generate(
                                userInfo.totalStar!,
                                (index) => Padding(
                                  padding: EdgeInsets.only(bottom: 10.0),
                                  child: userInfo.stars != null && userInfo.stars![index] != null
                                  ? BenekProfileStarDetailStarDataCard(
                                      starData: userInfo.stars![index],
                                    )
                                  : PastCareGiversLoadingWidget(),
                                )
                            ),
                          )
                        ],
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
