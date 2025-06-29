import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../edit_account_info_menu_item.dart';
import '../single_line_edit_text.dart';

class EditUserNameButton extends StatefulWidget {
  final UserInfo userInfo;
  final Future<void> Function(String) onDispatch;
  final void Function()? updateParentWidgetFunction;

  const EditUserNameButton({
    super.key,
    required this.userInfo,
    required this.onDispatch,
    this.updateParentWidgetFunction,
  });

  @override
  State<EditUserNameButton> createState() => _EditUserNameButtonState();
}

class _EditUserNameButtonState extends State<EditUserNameButton> {
  bool idle = false;

  @override
  Widget build(BuildContext context) {
    final UserInfo userInfo = widget.userInfo;
    return EditAccountInfoMenuItem(
        icon: FontAwesomeIcons.at,
        desc: BenekStringHelpers.locale('username'),
        text: userInfo.userName!,
        onTap: () async {
          await Navigator.push(
            context,
            PageRouteBuilder(
              opaque: false,
              barrierDismissible: false,
              pageBuilder: (context, _, __) => SingleLineEditTextScreen(
                info: BenekStringHelpers.locale('username'),
                textToEdit: userInfo.userName!,
                onDispatch: (text) => widget.onDispatch(text.toLowerCase()),
                shouldApprove: true,
                approvalTitle: BenekStringHelpers.locale('approveUsernameChanges'),
              ),
            ),
          );

          setState(() {
            idle = !idle;
          });

          widget.updateParentWidgetFunction != null
              ? widget.updateParentWidgetFunction!()
              : null;
        }
    );
  }
}
