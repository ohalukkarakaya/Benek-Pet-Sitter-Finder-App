import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';


import '../../../../../../../../common/constants/app_colors.dart';

class EditStoryDescTextFieldWidget extends StatefulWidget {
  final UserInfo userInfo;
  final String? desc;
  final void Function(String)? onChanged;

  const EditStoryDescTextFieldWidget({
    super.key,
    required this.userInfo,
    this.desc,
    this.onChanged,
  });

  @override
  _EditStoryDescTextFieldWidgetState createState() => _EditStoryDescTextFieldWidgetState();
}

class _EditStoryDescTextFieldWidgetState extends State<EditStoryDescTextFieldWidget> {
  late final FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 8.0),
            child: BenekCircleAvatar(
              isDefaultAvatar: widget.userInfo.profileImg!.isDefaultImg!,
              imageUrl: widget.userInfo.profileImg!.imgUrl!,
              width: 30.0,
              height: 30.0,
              borderWidth: 2.0,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: TextFormField(
              focusNode: _focusNode,
              initialValue: widget.desc,
              maxLength: 200,
              onChanged: widget.onChanged,
              maxLines: null,
              keyboardType: TextInputType.multiline,
              cursorColor: AppColors.benekWhite,
              style: lightTextStyle( textColor: AppColors.benekWhite ),
              textAlignVertical: TextAlignVertical.top,
              decoration: InputDecoration(
                counterText: '',
                hintText: BenekStringHelpers.locale('writeACaption'),
                contentPadding: EdgeInsets.zero,
                border: InputBorder.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}