import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../benek_circle_avatar/benek_circle_avatar.dart';

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
              style: const TextStyle(
                color: AppColors.benekWhite,
                fontSize: 12.0,
                fontWeight: FontWeight.w300,
                fontFamily: 'Qanelas',
              ),
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