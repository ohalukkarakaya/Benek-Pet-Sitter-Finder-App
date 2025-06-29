import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/benek_toast_helper.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_state.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/widgets/approve_screen.dart';
import 'edit_profile_screen/edit_text_screen.dart';

class PunishUserButton extends StatefulWidget {
  final bool isActive;

  const PunishUserButton({
    super.key,
    this.isActive = false,
  });

  @override
  State<PunishUserButton> createState() => _PunishUserButtonState();
}

class _PunishUserButtonState extends State<PunishUserButton> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = StoreProvider.of<AppState>(context);
    return GestureDetector(
      onTap: () async {
        if(store.state.selectedUserInfo!.userId == store.state.userInfo!.userId ){
          BenekToastHelper.showErrorToast(
            BenekStringHelpers.locale('operationFailed'),
            BenekStringHelpers.locale('youCantPunishYourself'),
            context
          );

          return;
        }

        String? punishmentDesc = await Navigator.push(
          context,
          PageRouteBuilder(
            opaque: false,
            barrierDismissible: false,
            pageBuilder: (context, _, __) => EditTextScreen(
              maxCharacter: 100,
              hintText: BenekStringHelpers.locale('enterPunishmentDesc'),
            ),
          ),
        );

        if (punishmentDesc == null || punishmentDesc == '') {
          return;
        }

        bool? isApproved = await Navigator.push(
          context,
          PageRouteBuilder(
            opaque: false,
            barrierDismissible: false,
            pageBuilder: (context, _, __) => ApproveScreen(
              title: BenekStringHelpers.locale('slideToApprove'),
            ),
          ),
        );

        if(isApproved == null || !isApproved){
          return;
        }

        await store.dispatch(punishUserAction(store.state.selectedUserInfo!.userId!, punishmentDesc));

        if(store.state.selectedUserInfo!.didUserBanned!){
          await store.dispatch(removeUserAction(store.state.selectedUserInfo!.userId));
          await store.dispatch(setSelectedUserAction(null));
          await store.dispatch(setStoriesAction(null));
        }
      },
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) {
          setState(() {
            isHovering = true;
          });
        },
        onExit: (_) {
          setState(() {
            isHovering = false;
          });
        },
        child: Container(
          width: 150,
          height: 50,
          decoration: BoxDecoration(
            color: widget.isActive && isHovering ? AppColors.benekBlack.withOpacity(0.5) : AppColors.benekBlackWithOpacity,
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          padding: const EdgeInsets.all(10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.block,
                color: widget.isActive ? AppColors.benekWhite : AppColors.benekBlack,
              ),
              const SizedBox(width: 5),
              Text(
                BenekStringHelpers.locale('punishUser'),
                style: semiBoldTextStyle(
                  textColor: widget.isActive ? AppColors.benekWhite : AppColors.benekBlack,
                )
              ),
            ],
          ),
        ),
      ),
    );
  }
}
