import 'package:benek_kulube/data/models/chat_models/punishment_info_model.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/punishment_count_card_big.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/punishment_data_card_loading_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/punishment_data_card_widget.dart';
import 'package:benek_kulube/redux/punishment/get_users_punishment_data.action.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/widgets/story_context_component/comments_component/comment_loading_element.dart';
import '../../../../loading_components/benek_blured_modal_barier.dart';

class PunishmentDetailScreen extends StatefulWidget {
  final int punishmentCount;

  const PunishmentDetailScreen({
    super.key,
    required this.punishmentCount,
  });

  @override
  State<PunishmentDetailScreen> createState() => _PunishmentDetailScreenState();
}

class _PunishmentDetailScreenState extends State<PunishmentDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final store = StoreProvider.of<AppState>(context);
      await store.dispatch(getUsersPunishmentDataAction(store.state.selectedUserInfo!.userId!));
    });
  }

  @override
  Widget build(BuildContext context) {
    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () => Navigator.of(context).pop(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 150.0),
          child: Material(
            color: Colors.transparent,
            child: StoreConnector<AppState, PunishmentInfoModel>(
              converter: (store) {
                final userInfo = store.state.selectedUserInfo;
                return userInfo!.punishmentInfo!;
              },
              builder: (context, vm) {
                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 50.0),
                      child: PunishmentCountCardBig(
                        punishmentCount: widget.punishmentCount,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 50.0),
                      child: Center(
                        child: Column(
                          children: List.generate(
                            widget.punishmentCount,
                                (index) {
                              final count = vm.punishmentList?.length ?? 0;
                              final item = count > index
                                  ? vm.punishmentList![index]
                                  : null;

                              return item != null
                                  ? PunishmentCardWidget(
                                    key: ValueKey("punishment-${item.id}"),
                                    punishment: item,
                                  )
                                  : PunishmentCardLoadingElement(
                                    key: ValueKey("loading-$index"),
                                  );
                            },
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}