import 'dart:developer';

import 'package:benek_kulube/data/models/content_models/comment_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import '../../../../store/actions/app_actions.dart';
import '../../../constants/app_colors.dart';
import '../../../utils/benek_string_helpers.dart';
import '../../../utils/styles.text.dart';

class LeaveCommentComponent extends StatefulWidget {
  final String storyId;
  final String? selectedCommentId;

  const LeaveCommentComponent({
    super.key,
    required this.storyId,
    this.selectedCommentId
  });

  @override
  State<LeaveCommentComponent> createState() => _LeaveCommentComponentState();
}

class _LeaveCommentComponentState extends State<LeaveCommentComponent> {
  late final FocusScopeNode _focusScopeNode;
  late final FocusNode _textFocusNode;
  late final TextEditingController _textController;

  bool isButtonHovered = false;
  bool isFocused = false;
  bool isSendingRequest = false;

  @override
  void initState() {
    super.initState();
    _focusScopeNode = FocusScopeNode();
    _textFocusNode = FocusNode();
    _textController = TextEditingController();

    _textFocusNode.addListener(_onFocusChanged);
  }

  @override
  void dispose() {
    _focusScopeNode.dispose();
    _textFocusNode.dispose();
    super.dispose();
  }

  void _onFocusChanged() {
    setState(() {
      isFocused = _textFocusNode.hasFocus;
    });
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    UserInfo userInfo = store.state.userInfo!;
    bool isReply = widget.selectedCommentId != null;
    bool isReadyToSend = _textController.text.trim().isNotEmpty && isButtonHovered;

    return SizedBox(
      width: double.infinity,
      height: 90.0,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            flex: 8,
            child: Container(
              decoration: BoxDecoration(
                color: isFocused ? AppColors.benekLightBlue : AppColors.benekBlack,
                borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: BenekCircleAvatar(
                      isDefaultAvatar: userInfo.profileImg!.isDefaultImg!,
                      imageUrl: userInfo.profileImg!.imgUrl!,
                      width: 30.0,
                      height: 30.0,
                      borderWidth: 2.0,
                      bgColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                    ),
                  ),

                  const SizedBox(width: 8),

                  Expanded(
                    child: FocusScope(
                      node: _focusScopeNode,
                      child: TextFormField(
                        focusNode: _textFocusNode,
                        controller: _textController,
                        maxLength: 200,
                        onChanged: (value) {
                          setState(() {});
                        },
                        maxLines: null,
                        keyboardType: TextInputType.multiline,
                        cursorColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                        style: lightTextStyle( textColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite ),
                        textAlignVertical: TextAlignVertical.top,
                        decoration: InputDecoration(
                          counterText: '',
                          hintText: isReply
                              ? BenekStringHelpers.locale('writeAReply')
                              : BenekStringHelpers.locale('writeAComment'),
                          hintStyle: isFocused ? lightTextStyle( textColor: AppColors.benekGrey ) : null,
                          contentPadding: EdgeInsets.zero,
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(width: 8),

          Expanded(
            flex: 2,
            child: MouseRegion(
              cursor: isReadyToSend
                  && !isSendingRequest
                    ? SystemMouseCursors.click
                    : SystemMouseCursors.move,
              onHover: (_) {
                setState(() {
                  isButtonHovered = true;
                });
              },
              onExit: (_) {
                setState(() {
                  isButtonHovered = false;
                });
              },
              child: Container(
                height: 80.0,
                padding: const EdgeInsets.symmetric(horizontal: 25.0, vertical: 25.0),
                decoration: BoxDecoration(
                  color: isReadyToSend
                    && !isSendingRequest
                      ? AppColors.benekLightBlue
                      : AppColors.benekBlack,
                  borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                ),
                child: GestureDetector(
                  onTap: isReadyToSend
                    && !isSendingRequest
                      ? () async {
                          setState(() {
                            isSendingRequest = true;
                          });
                          await store.dispatch(
                              postStoryCommentOrReplyRequestAction(
                                widget.storyId,
                                  _textController.text,
                                widget.selectedCommentId
                              )
                          );
                          setState(() {
                            _textController.clear();;
                            isSendingRequest = false;
                          });
                        }
                      : null,
                  child: !isSendingRequest
                  ? Icon(
                      Icons.send,
                      color: isReadyToSend
                          ? AppColors.benekBlack
                          : AppColors.benekWhite,
                      size: 20,
                    )
                  : const BenekProcessIndicator(
                    width: 5.0,
                    height: 5.0,
                  )
                )
              ),
            ),
          ),
        ],
      )
    );
  }
}
