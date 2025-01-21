import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../edit_account_info_menu_item.dart';
import '../password_textfield.dart';
import '../single_line_edit_text.dart';

class EditEmailButton extends StatefulWidget {
  final UserInfo userInfo;
  final Future<void> Function(String) onDispatch;
  final Future<void> Function(String, String) onVerifyDispatch;
  final Future<void> Function(String) onResendDispatch;

  const EditEmailButton({
    super.key,
    required this.userInfo,
    required this.onDispatch,
    required this.onVerifyDispatch,
    required this.onResendDispatch,
  });

  @override
  State<EditEmailButton> createState() => _EditEmailButtonState();
}

class _EditEmailButtonState extends State<EditEmailButton> {
  bool idle = false;

  bool isDone = true;
  bool isResend = false;
  String? newEmailForResend;

  @override
  Widget build(BuildContext context) {
    final UserInfo userInfo = widget.userInfo;

    return EditAccountInfoMenuItem(
      icon: Icons.email,
      desc: BenekStringHelpers.locale('email'),
      text: userInfo.email != null && userInfo.email!.isNotEmpty
          ? userInfo.email!
          : BenekStringHelpers.locale('enterEmail'),

      onTap: () async {

        setState(() {
          isDone = false;
        });

        while( !isDone ){
          String? newEmail = await Navigator.push(
            context,
            PageRouteBuilder(
              opaque: false,
              barrierDismissible: false,
              pageBuilder: (context, _, __) => SingleLineEditTextScreen(
                info: BenekStringHelpers.locale('email'),
                hint: BenekStringHelpers.locale('enterEmail'),
                textToEdit: !isResend || newEmailForResend == null
                    ? userInfo.email!
                    : newEmailForResend!,
                validation: (text) => text.contains('@') && text.toUpperCase().contains('.COM'),
                validationErrorMessage: BenekStringHelpers.locale('invalidEmail'),
                onDispatch: !isResend
                    ? (text) => widget.onDispatch(text.toLowerCase())
                    : (text) => widget.onResendDispatch(text.toLowerCase()),
                shouldApprove: true,
                approvalTitle: BenekStringHelpers.locale('approveEmailChanges'),
              ),
            ),
          );

          if(newEmail == null || newEmail.isEmpty){
            setState(() {
              isDone = true;
              isResend = false;
              newEmailForResend = null;
              idle = !idle;
            });
            continue;
          }

          String? resp = await Navigator.push(
            context,
            PageRouteBuilder(
              opaque: false,
              barrierDismissible: false,
              pageBuilder: (context, _, __) => PasswordTextfield(
                verifyingString: newEmail,
                onDispatch: (text) => widget.onVerifyDispatch(newEmail.toLowerCase(), text.toLowerCase()),
              ),
            ),
          );

          if(resp != null && resp.isNotEmpty && resp == "reSend"){
            setState(() {
              isResend = true;
              newEmailForResend = newEmail.toLowerCase();
            });
            continue;
          }

          setState(() {
            isDone = true;
            idle = !idle;
          });
        }
      },
    );
  }
}
