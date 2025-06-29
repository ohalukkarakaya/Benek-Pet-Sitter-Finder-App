import 'package:flutter/material.dart';
import 'package:flutter/material.dart';


import '../../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../edit_account_info_menu_item.dart';
import '../single_line_edit_text.dart';

class EditFullNameButton extends StatefulWidget {
  final UserInfo userInfo;
  final Future<void> Function(String) onDispatch;

  const EditFullNameButton({
    super.key,
    required this.userInfo,
    required this.onDispatch,
  });

  @override
  State<EditFullNameButton> createState() => _EditFullNameButtonState();
}

class _EditFullNameButtonState extends State<EditFullNameButton> {
  bool idle =false;

  @override
  Widget build(BuildContext context) {
    final UserInfo userInfo = widget.userInfo;
    final Future<void> Function(String) onDispatch = widget.onDispatch;

    return EditAccountInfoMenuItem(
      icon: Icons.perm_identity,
      desc: BenekStringHelpers.locale('fullname'),
      text: BenekStringHelpers.getUsersFullName(
          userInfo.identity!.firstName!,
          userInfo.identity!.lastName!,
          userInfo.identity!.middleName
      ),

      onTap: () async {
        await Navigator.push(
          context,
          PageRouteBuilder(
            opaque: false,
            barrierDismissible: false,
            pageBuilder: (context, _, __) => SingleLineEditTextScreen(
              info: BenekStringHelpers.locale('fullname'),
              textToEdit: BenekStringHelpers.getUsersFullName(
                  userInfo.identity!.firstName!,
                  userInfo.identity!.lastName!,
                  userInfo.identity!.middleName
              ),
              validation: (text) => text.split(' ').length >= 2,
              validationErrorMessage: BenekStringHelpers.locale('missingLastName'),
              onDispatch: (text) => onDispatch(text),
              shouldApprove: true,
              approvalTitle: BenekStringHelpers.locale('approveNameChanges'),
            ),
          ),
        );

        setState(() {
          idle = !idle;
        });
      },
    );
  }
}
