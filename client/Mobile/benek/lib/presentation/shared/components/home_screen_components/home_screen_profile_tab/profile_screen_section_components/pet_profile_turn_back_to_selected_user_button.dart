import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek/store/app_state.dart';
import 'package:benek/store/actions/app_actions.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';

class PetProfileTurnBackToSelectedUserButton extends StatefulWidget {
  const PetProfileTurnBackToSelectedUserButton({super.key});

  @override
  State<PetProfileTurnBackToSelectedUserButton> createState() => _PetProfileTurnBackToSelectedUserButtonState();
}

class _PetProfileTurnBackToSelectedUserButtonState extends State<PetProfileTurnBackToSelectedUserButton> {
  bool isHovered = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async{
        Store<AppState> store = StoreProvider.of<AppState>(context);

        await store.dispatch( IsLoadingStateAction( isLoading: true ) );

        await store.dispatch( setSelectedPetAction( null ) );
        await store.dispatch( setStoriesAction( null ) );

        UserInfo user = store.state.selectedUserInfo!;
        await store.dispatch( setSelectedUserAction( null ) );
        await Future.delayed(const Duration(milliseconds: 50));
        await store.dispatch( setSelectedUserAction( user ) );

        await store.dispatch( IsLoadingStateAction( isLoading: false ) );
      },
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => isHovered = true),
        onExit: (_) => setState(() => isHovered = false),
        child: Padding(
          padding: const EdgeInsets.only(
              top: 20.0,
              right: 40.0
          ),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all( 17.0 ),
            decoration: BoxDecoration(
              color: !isHovered ? AppColors.benekBlack.withOpacity(0.2) : AppColors.benekLightBlue,
              borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Padding(
                  padding: EdgeInsets.all(5.0),
                  child: Icon(
                    BenekIcons.left,
                    color: !isHovered ? AppColors.benekWhite : AppColors.benekBlack,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 15),
                Text(
                  BenekStringHelpers.locale('turnBackToSelectedUser'),
                  style: semiBoldTextStyle(
                    textFontSize: 15,
                    textColor: !isHovered ? AppColors.benekWhite : AppColors.benekBlack,
                  ),
                ),
              ]
            ),
          ),
        ),
      ),
    );
  }
}
