import 'dart:developer';

import 'package:benek/data/models/content_models/comment_model.dart';
import 'package:benek/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:benek/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_state.dart';

import '../../../../../data/models/story_models/story_model.dart';
import '../../../../../presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import '../../../../constants/app_colors.dart';
import '../../../../utils/benek_string_helpers.dart';
import '../../../../utils/styles.text.dart';
import '../last_three_comment_replier_profile_stack_widget.dart';

class EditCommentScreen extends StatefulWidget {
  final String storyId;
  final String commentId;
  final String? replyId;
  final String textToEdit;

  const EditCommentScreen({
    super.key,
    required this.storyId,
    required this.commentId,
    this.replyId,
    required this.textToEdit,
  });

  @override
  State<EditCommentScreen> createState() => _EditCommentScreenState();
}

class _EditCommentScreenState extends State<EditCommentScreen> {
  late FocusNode _focusNodeEditComment;
  late final FocusScopeNode _focusScopeNodeEditComment;
  late final FocusNode _textFocusNodeEditComment;
  late final TextEditingController _textControllerEditComment;

  late final bool isReply;
  bool isFocused = false;
  bool isSendingRequest = false;

  void _onFocusChanged() {
    setState(() {
      isFocused = _textFocusNodeEditComment.hasFocus;
    });
  }

  @override
  void initState() {
    super.initState();
    _focusNodeEditComment = FocusNode();
    _focusScopeNodeEditComment = FocusScopeNode();
    _textFocusNodeEditComment = FocusNode();
    _textControllerEditComment = TextEditingController();

    _textFocusNodeEditComment.addListener(_onFocusChanged);

    isReply = widget.replyId != null;

    _textControllerEditComment.text = widget.textToEdit;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      FocusScope.of(context).requestFocus(_textFocusNodeEditComment);
    });
  }

  @override
  void dispose() {
    _focusNodeEditComment.dispose();
    _focusScopeNodeEditComment.dispose();
    _textFocusNodeEditComment.dispose();
    _textControllerEditComment.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    StoryModel story = store.state.storiesToDisplay!.firstWhere((StoryModel story) => story.storyId == widget.storyId);
    CommentModel commentObject = story.comments!.firstWhere((CommentModel comment) => comment.id == widget.commentId);
    CommentModel? replyObject = isReply ? commentObject.replies!.firstWhere((CommentModel reply) => reply.id == widget.replyId) : null;
    CommentModel editingObject = isReply ? replyObject! : commentObject;

    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () {
        Navigator.of(context).pop();
      },
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Container(
            width: 500,
            height: 169,
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: isFocused ? AppColors.benekLightBlue : AppColors.benekBlack,
              borderRadius: BorderRadius.circular(6.0),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 0.0),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    LayoutBuilder(
                      builder: (context, constraints) {
                        return Stack(
                          children: [
                            Column(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                BenekCircleAvatar(
                                  imageUrl: editingObject.user!.profileImg!.imgUrl!,
                                  width: 30.0,
                                  height: 30.0,
                                  isDefaultAvatar: editingObject.user!.profileImg!.isDefaultImg!,
                                  bgColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                                  borderWidth: 2.0,
                                ),
                                editingObject.lastThreeRepliedUsers != null && editingObject.lastThreeRepliedUsers!.isNotEmpty
                                    ? LastThreeCommentReplierProfileStackWidget(
                                  size: 30.0,
                                  users: editingObject.lastThreeRepliedUsers!,
                                  borderColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                                )
                                    : const SizedBox(),
                              ],
                            ),
                            editingObject.lastThreeRepliedUsers != null && editingObject.lastThreeRepliedUsers!.isNotEmpty
                                ? Positioned(
                              top: 40,
                              bottom: 40,
                              left: 15,
                              child: Container(
                                width: 1.0,
                                color: AppColors.benekGrey,
                                height: constraints.maxHeight,
                              ),
                            )
                                : const SizedBox(),
                          ],
                        );
                      },
                    ),
                    const SizedBox(width: 10.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                editingObject.user!.userName!,
                                style: semiBoldTextWithoutColorStyle().copyWith(
                                  color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                                ),
                              ),
                              Text(
                                BenekStringHelpers.getDateAsString(editingObject.createdAt!),
                                style: regularTextWithoutColorStyle().copyWith(
                                  color: AppColors.benekGrey,
                                  fontSize: 8.0,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4.0),
                          SizedBox(
                            height: 50.0,
                            child: ScrollConfiguration(
                              behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                              child: SingleChildScrollView(
                                physics: const BouncingScrollPhysics(),
                                child: FocusScope(
                                  node: _focusScopeNodeEditComment,
                                  child: TextFormField(
                                    focusNode: _textFocusNodeEditComment,
                                    controller: _textControllerEditComment,
                                    maxLength: 200,
                                    onChanged: (value) {
                                      setState(() {});
                                    },
                                    maxLines: null,
                                    keyboardType: TextInputType.multiline,
                                    cursorColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                                    style: lightTextStyle(textColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite),
                                    textAlignVertical: TextAlignVertical.top,
                                    decoration: InputDecoration(
                                      counterText: '',
                                      hintText: isReply
                                          ? BenekStringHelpers.locale('writeAReply')
                                          : BenekStringHelpers.locale('writeAComment'),
                                      hintStyle: isFocused ? lightTextStyle(textColor: AppColors.benekGrey) : null,
                                      contentPadding: EdgeInsets.zero,
                                      border: InputBorder.none,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  GestureDetector(
                                    onTap: () {
                                      log('Reply to comment');
                                    },
                                    child: Text(
                                      '${editingObject.replyCount} ${BenekStringHelpers.locale('reply')}',
                                      style: regularTextWithoutColorStyle().copyWith(
                                        color: AppColors.benekGrey,
                                        fontSize: 12.0,
                                      ),
                                    ),
                                  ),
                                  Text(
                                    '  |  ',
                                    style: regularTextWithoutColorStyle().copyWith(
                                      color: AppColors.benekGrey,
                                      fontSize: 12.0,
                                    ),
                                  ),
                                  Text(
                                    '${editingObject.likeCount} ${BenekStringHelpers.locale('like')}',
                                    style: regularTextWithoutColorStyle().copyWith(
                                      color: AppColors.benekGrey,
                                      fontSize: 12.0,
                                    ),
                                  ),
                                ],
                              ),
                              IconButton(
                                padding: EdgeInsets.zero,
                                onPressed: () async {
                                  if (!isSendingRequest) {
                                    setState(() {
                                      isSendingRequest = true;
                                    });
                                    await store.dispatch(
                                      putEditStoryCommentOrReplyRequestAction(
                                        _textControllerEditComment.text,
                                        widget.storyId,
                                        widget.commentId,
                                        widget.replyId,
                                      ),
                                    );
                                    setState(() {
                                      isSendingRequest = false;
                                    });
                                    Navigator.of(context).pop();
                                  }
                                },
                                icon: !isSendingRequest
                                    ? Icon(
                                      Icons.send,
                                      color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                                      size: 15,
                                    )
                                    : BenekProcessIndicator(
                                      color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                                      width: 15.0,
                                      height: 15.0,
                                    ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
