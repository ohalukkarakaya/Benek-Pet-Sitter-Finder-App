import 'package:flutter/material.dart';
import 'package:flutter/material.dart';


import '../../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../edit_account_info_menu_item.dart';
import '../single_line_edit_text.dart';

class EditTcNoButton extends StatefulWidget {
  final UserInfo userInfo;
  final Future<void> Function(String) onDispatch;

  const EditTcNoButton({
    super.key,
    required this.userInfo,
    required this.onDispatch,
  });

  @override
  State<EditTcNoButton> createState() => _EditTcNoButtonState();
}

class _EditTcNoButtonState extends State<EditTcNoButton> {
  bool idle = false;

  @override
  Widget build(BuildContext context) {

    UserInfo userInfo = widget.userInfo;


    return EditAccountInfoMenuItem(
      icon: Icons.verified_user,
      desc: BenekStringHelpers.locale('TCNo'),
      text: userInfo.identity != null && userInfo.identity!.nationalIdentityNumber != null && userInfo.identity!.nationalIdentityNumber!.isNotEmpty
          ? userInfo.identity!.nationalIdentityNumber!
          : BenekStringHelpers.locale('enterTCNo'),
        onTap: () async {
          await Navigator.push(
            context,
            PageRouteBuilder(
              opaque: false,
              barrierDismissible: false,
              pageBuilder: (context, _, __) => SingleLineEditTextScreen(
                info: BenekStringHelpers.locale('TCNo'),
                hint: BenekStringHelpers.locale('enterTCNo'),
                textToEdit: userInfo.identity!.nationalIdentityNumber!,
                onDispatch: (text) => widget.onDispatch(text.toLowerCase()),
                shouldApprove: true,
                approvalTitle: BenekStringHelpers.locale('approveTCNOChanges'),
              ),
            ),
          );

          setState(() {
            idle = !idle;
          });
        }
    );
  }
}
