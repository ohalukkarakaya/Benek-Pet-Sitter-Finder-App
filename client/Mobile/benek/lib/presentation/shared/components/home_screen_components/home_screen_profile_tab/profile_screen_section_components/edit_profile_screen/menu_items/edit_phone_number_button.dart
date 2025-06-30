

import 'package:flutter/material.dart';


import '../../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../edit_account_info_menu_item.dart';
import '../password_textfield.dart';
import '../single_line_edit_text.dart';

class EditPhoneNumberButton extends StatefulWidget {
  final UserInfo userInfo;
  final Future<void> Function(String) onDispatch;
  final Future<void> Function(String, String) onVerifyDispatch;
  final Future<void> Function(String)? onResendDispatch;

  const EditPhoneNumberButton({
    super.key,
    required this.userInfo,
    required this.onDispatch,
    required this.onVerifyDispatch,
    this.onResendDispatch,
  });

  @override
  State<EditPhoneNumberButton> createState() => _EditPhoneNumberButtonState();
}

class _EditPhoneNumberButtonState extends State<EditPhoneNumberButton> {
  bool idle = false;

  bool isDone = true;
  bool isResend = false;
  String? newPhoneNumberForResend;

  @override
  Widget build(BuildContext context) {
    final UserInfo userInfo = widget.userInfo;

    return EditAccountInfoMenuItem(
      icon: Icons.phone,
      desc: BenekStringHelpers.locale('phoneNumber'),
      text: userInfo.phone != null && userInfo.phone!.isNotEmpty
          ? userInfo.phone!
          : BenekStringHelpers.locale('enterPhoneNumber'),

      onTap: () async {
        setState(() {
          isDone = false;
        });

        while( !isDone ){
          String? newPhoneNumber = await Navigator.push(
            context,
            PageRouteBuilder(
              opaque: false,
              barrierDismissible: false,
              pageBuilder: (context, _, __) => SingleLineEditTextScreen(
                info: BenekStringHelpers.locale('phoneNumber'),
                hint: BenekStringHelpers.locale('enterPhoneNumber'),
                textToEdit: !isResend || newPhoneNumberForResend == null
                    ? userInfo.phone!.startsWith('+9') ? userInfo.phone = userInfo.phone!.substring(2) : userInfo.phone
                    : newPhoneNumberForResend,
                validation: (text) => text.length == 11 && text.startsWith('05') && RegExp(r'^[0-9]+$').hasMatch(text),
                validationErrorMessage: BenekStringHelpers.locale('invalidPhoneNumber'),
                onDispatch: !isResend
                    ? (text) => widget.onDispatch(text.toLowerCase())
                    : widget.onResendDispatch != null
                        ? (text) => widget.onResendDispatch!(text.toLowerCase())
                        : null,
                shouldApprove: true,
                approvalTitle: BenekStringHelpers.locale('approvePhoneNumberChanges'),
              ),
            ),
          );

          if( newPhoneNumber == null || newPhoneNumber.isEmpty ){
            setState(() {
              isDone = true;
              isResend = false;
              newPhoneNumberForResend = null;
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
                verifyingString: newPhoneNumber,
                onDispatch: (text) => widget.onVerifyDispatch(newPhoneNumber.toLowerCase(), text.toLowerCase()),
              ),
            ),
          );

          if(resp != null && resp.isNotEmpty && resp == "reSend"){
            setState(() {
              isResend = true;
              newPhoneNumberForResend = newPhoneNumber.toLowerCase();
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
