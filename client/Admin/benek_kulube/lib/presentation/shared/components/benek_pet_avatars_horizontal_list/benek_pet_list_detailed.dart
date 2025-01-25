import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../store/actions/app_actions.dart';
import '../../../../common/constants/app_colors.dart';
import '../../../../data/models/user_profile_models/user_info_model.dart';
import '../loading_components/benek_blured_modal_barier.dart';
import 'benek_pet_list_element.dart';

class BenekPetListDetailedScreen extends StatefulWidget {
  const BenekPetListDetailedScreen({super.key});

  @override
  State<BenekPetListDetailedScreen> createState() => _BenekPetListDetailedScreenState();
}

class _BenekPetListDetailedScreenState extends State<BenekPetListDetailedScreen> {
  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = StoreProvider.of<AppState>(context);
    final UserInfo selectedUserInfo = store.state.selectedUserInfo!;

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
                    child: Center(
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
                                          selectedUserInfo.pets!.length,
                                          (index) => Padding(
                                            padding: EdgeInsets.only(bottom: 25.0),
                                            child: BenekPetListElementWidget(
                                              pet: selectedUserInfo.pets![index],
                                            ),
                                            )
                                          )
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          )
                        ),
                      ),
                    ),
                )
                )
              ]
          ),
        ),
      )
    );
  }
}
