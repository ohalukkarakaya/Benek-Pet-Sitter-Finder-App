import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../edit_account_info_menu_item.dart';
import '../single_line_edit_text.dart';

class EditPaymenInfoButton extends StatefulWidget {
  final UserInfo userInfo;
  final Future<void> Function(String) onDispatch;

  const EditPaymenInfoButton({
    super.key,
    required this.userInfo,
    required this.onDispatch,
  });

  @override
  State<EditPaymenInfoButton> createState() => _EditPaymenInfoButtonState();
}

class _EditPaymenInfoButtonState extends State<EditPaymenInfoButton> {
  bool idle = false;

  @override
  Widget build(BuildContext context) {
    UserInfo userInfo = widget.userInfo;

    return EditAccountInfoMenuItem(
      icon: Icons.attach_money_rounded,
      desc: BenekStringHelpers.locale('iban'),
      text: userInfo.iban != null && userInfo.iban!.isNotEmpty
          ? userInfo.iban!
          : BenekStringHelpers.locale('enterIban'),
      onTap:() async {
        await Navigator.push(
          context,
          PageRouteBuilder(
            opaque: false,
            barrierDismissible: false,
            pageBuilder: (context, _, __) => SingleLineEditTextScreen(
              info: BenekStringHelpers.locale('iban'),
              textToEdit: userInfo.iban!.toUpperCase(),
              onDispatch: (text) => widget.onDispatch(text.toUpperCase()),
              shouldApprove: true,
              approvalTitle: BenekStringHelpers.locale('approveIbanChanges'),
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
