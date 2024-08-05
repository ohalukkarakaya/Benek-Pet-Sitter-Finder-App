import 'dart:developer';

// ignore: depend_on_referenced_packages
import 'package:benek_kulube/common/widgets/approve_screen.dart';
import 'package:benek_kulube/common/widgets/story_context_component/comments_component/edit_comment_components/edit_comment_screen.dart';
import 'package:benek_kulube/redux/like_story_comment/like_story_comment.action.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/common/widgets/benek_like_button/like_buton.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../data/models/content_models/comment_model.dart';
import '../../../../data/models/story_models/story_model.dart';
import '../../../../presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import '../../../../redux/delete_story_comment_or_reply/delete_story_comment_or_reply.action.dart';
import '../../../constants/app_colors.dart';
import 'last_three_comment_replier_profile_stack_widget.dart';

class CommentCardWidget extends StatefulWidget {
  final bool isSelectedComment;
  final Function()? slectCommentFunction;
  final Function()? resetSelectedCommentFunction;
  final String? replyId;
  final String commentId;
  final String storyId;

  const CommentCardWidget({
    super.key,
    this.isSelectedComment = false,
    this.slectCommentFunction,
    this.resetSelectedCommentFunction,
    this.replyId,
    required this.commentId,
    required this.storyId,
  });

  @override
  State<CommentCardWidget> createState() => _CommentCardWidgetState();
}

class _CommentCardWidgetState extends State<CommentCardWidget> {
  final GlobalKey _textKey = GlobalKey();
  int? _previousCommentsCount;
  CommentModel? _previousComment;
  double? textHeight;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final commentCount = _getCommentCount();
    _previousCommentsCount ??= commentCount;
  }

  @override
  void didUpdateWidget(CommentCardWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    final commentCount = _getCommentCount();

    final store = StoreProvider.of<AppState>(context);
    final currentComment = widget.replyId == null
      ? store.state.storiesToDisplay?.firstWhere(
              (story) => story.storyId == widget.storyId,
          orElse: () => StoryModel(),
        ).comments?.firstWhere(
              (comment) => comment.id == widget.commentId,
          orElse: () => CommentModel(),
        )
     : store.state.storiesToDisplay?.firstWhere(
              (story) => story.storyId == widget.storyId,
          orElse: () => StoryModel(),
        ).comments?.firstWhere(
              (comment) => comment.id == widget.commentId,
          orElse: () => CommentModel(),
        ).replies?.firstWhere(
              (reply) => reply.id == widget.replyId,
          orElse: () => CommentModel(),
        );

    if (commentCount != _previousCommentsCount) {
      _previousCommentsCount = commentCount;
      _updateTextHeight();
    }

    if (_previousComment != null && currentComment != null && _previousComment != currentComment) {
      _updateTextHeight();
    }

    _previousComment = currentComment;
  }

  bool idleUpdate = false;

  int _getCommentCount() {
    final store = StoreProvider.of<AppState>(context);
    final story = store.state.storiesToDisplay?.firstWhere(
          (story) => story.storyId == widget.storyId,
      orElse: () => StoryModel(),
    );

    return widget.replyId == null
        ? story?.comments?.length ?? 0
        : story?.comments?.firstWhere(
              (comment) => comment.id == widget.commentId,
          orElse: () => CommentModel(),
        ).replies?.length ?? 0;
  }

  void _updateTextHeight() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final RenderBox? renderBox = _textKey.currentContext?.findRenderObject() as RenderBox?;
      final size = renderBox?.size;
      setState(() {
        textHeight = size?.height;
      });
    });
  }

  Future<bool?> onCommentLikeButtonTapped(bool didLiked) async {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    await store.dispatch(likeStoryCommentOrReplyRequestAction(widget.storyId, widget.commentId, widget.replyId));

    setState(() {
      idleUpdate = !idleUpdate;
    });

    return !didLiked;
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final RenderBox? renderBox = _textKey.currentContext?.findRenderObject() as RenderBox?;
      final size = renderBox?.size;
      textHeight = size?.height;
    });
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, CommentModel?>(
      converter: (store) {
        return widget.replyId == null

        ? store.state.storiesToDisplay?.firstWhere(
                (story) => story.storyId == widget.storyId,
            orElse: () => StoryModel(),
          ).comments?.firstWhere(
                (comment) => comment.id == widget.commentId,
            orElse: () => CommentModel(),
          )

        : store.state.storiesToDisplay?.firstWhere(
                (story) => story.storyId == widget.storyId,
            orElse: () => StoryModel(),
          ).comments?.firstWhere(
                (comment) => comment.id == widget.commentId,
            orElse: () => CommentModel(),
          ).replies?.firstWhere(
                (reply) => reply.id == widget.replyId,
            orElse: () => CommentModel(),
          );
      },
      builder: (context, comment) {
        Store<AppState> store = StoreProvider.of<AppState>(context);
        bool isCommentBelongsToUser = comment?.user?.userId == store.state.userInfo?.userId;

        bool _didLiked = comment?.didUserLiked ?? false;

        return comment != null
            ? Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: SizeChangedLayoutNotifier(
            child: NotificationListener<SizeChangedLayoutNotification>(
              onNotification: (notification) {
                _updateTextHeight();
                return true;
              },
              child: Container(
                decoration: const BoxDecoration(
                  color: AppColors.benekBlack,
                  borderRadius: BorderRadius.all(Radius.circular(8.0)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      LayoutBuilder(
                        builder: (context, constraints) {
                          return Column(
                            mainAxisAlignment: widget.isSelectedComment ? MainAxisAlignment.start : MainAxisAlignment.spaceBetween,
                            children: [
                              widget.isSelectedComment
                              ? IconButton(
                                  onPressed: () => widget.resetSelectedCommentFunction!(),
                                  icon: const Icon(
                                    Icons.arrow_back_ios,
                                    color: AppColors.benekWhite,
                                    size: 14,
                                  ),
                              ) : const SizedBox(),

                              SizedBox( height: widget.isSelectedComment ? 10.0 : 0.0 ),

                              Stack(
                                children: [
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      BenekCircleAvatar(
                                        imageUrl: comment.user!.profileImg!.imgUrl!,
                                        width: 30.0,
                                        height: 30.0,
                                        isDefaultAvatar: comment.user!.profileImg!.isDefaultImg!,
                                        bgColor: AppColors.benekWhite,
                                        borderWidth: 2.0,
                                      ),
                                      SizedBox(
                                        height: textHeight != null ? textHeight! + 40 : 60,
                                      ),
                                      comment.lastThreeRepliedUsers != null
                                      && comment.lastThreeRepliedUsers!.isNotEmpty
                                      && !widget.isSelectedComment
                                          ? LastThreeCommentReplierProfileStackWidget(
                                              size: 30.0,
                                              users: comment.lastThreeRepliedUsers!,
                                            )
                                          : const SizedBox(),
                                    ],
                                  ),
                                  comment.lastThreeRepliedUsers != null &&
                                  comment.lastThreeRepliedUsers!.isNotEmpty
                                  && !widget.isSelectedComment
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
                              ),
                            ],
                          );
                        },
                      ),
                      const SizedBox(width: 10.0),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            !widget.isSelectedComment
                                ? Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                     Text(
                                        comment.user!.userName!,
                                        style: semiBoldTextWithoutColorStyle().copyWith(
                                          color: AppColors.benekWhite,
                                        ),
                                      ),
                                      Text(
                                        BenekStringHelpers.getDateAsString(comment.createdAt!),
                                        style: regularTextWithoutColorStyle().copyWith(
                                          color: AppColors.benekGrey,
                                          fontSize: 8.0,
                                        ),
                                      ),
                                    ],
                                  )
                                : const SizedBox(),

                            const SizedBox(height: 4.0),
                            MouseRegion(
                              cursor: widget.replyId == null && !widget.isSelectedComment ? SystemMouseCursors.click : SystemMouseCursors.basic,
                              child: GestureDetector(
                                onTap: widget.replyId == null && !widget.isSelectedComment ? widget.slectCommentFunction : null,
                                child: widget.isSelectedComment
                                ? RichText(
                                  text: TextSpan(
                                    children: [
                                      TextSpan(
                                        text: '${comment.user!.userName}  :  ',
                                        style: boldTextStyle( textColor: AppColors.benekWhite ),
                                      ),
                                      TextSpan(
                                        text: comment.comment,
                                        style: regularTextStyle( textColor: AppColors.benekWhite ),
                                      ),
                                    ],
                                  ),
                                )

                                : Text(
                                  widget.replyId == null
                                      ? comment.comment!
                                      : comment.reply!,
                                  key: _textKey,
                                  style: regularTextWithoutColorStyle().copyWith(
                                    color: AppColors.benekWhite,
                                  ),
                                ),
                              ),
                            ),
                            SizedBox(height: widget.isSelectedComment ? 15.0 : 0.0),
                            widget.isSelectedComment
                                ? const Divider(color: AppColors.benekGrey)
                                : const SizedBox(height: 15.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [

                                widget.replyId == null
                                && !widget.isSelectedComment
                                ? IconButton(
                                    padding: EdgeInsets.zero,
                                    onPressed: widget.replyId == null ? widget.slectCommentFunction : null,
                                    icon: const Icon(
                                      Icons.chat_bubble_outline,
                                      color: AppColors.benekWhite,
                                      size: 14,
                                    ),
                                )
                                : const SizedBox(),

                                SizedBox(width: widget.replyId == null ? 10.0 : 0.0),
                                MouseRegion(
                                  cursor: SystemMouseCursors.click,
                                  child: LikeButton(
                                    size: 15.0,
                                    isLiked: _didLiked,
                                    onTap: onCommentLikeButtonTapped,
                                    likeBuilder: (isLiked) {
                                      return Center(
                                        child: Icon(
                                          isLiked ? Icons.favorite : Icons.favorite_border,
                                          color: isLiked ? AppColors.benekRed : AppColors.benekWhite,
                                          size: 15,
                                        ),
                                      );
                                    },
                                  ),
                                ),
                                SizedBox(width: isCommentBelongsToUser ? 20.0 : 0.0),
                                isCommentBelongsToUser
                                    ? IconButton(
                                      padding: EdgeInsets.zero,
                                      onPressed: (){
                                        Navigator.push(
                                          context,
                                          PageRouteBuilder(
                                            opaque: false,
                                            barrierDismissible: false,
                                            pageBuilder: (context, _, __) => EditCommentScreen(
                                                storyId: widget.storyId,
                                                commentId: widget.commentId,
                                                replyId: widget.replyId,
                                                textToEdit: widget.replyId == null ? comment.comment! : comment.reply!,
                                            ),
                                          ),
                                        );
                                      },
                                      icon: const Icon(
                                        Icons.edit_note_outlined,
                                        color: AppColors.benekWhite,
                                        size: 16,
                                      ),
                                    )
                                    : const SizedBox(),

                                isCommentBelongsToUser
                                    ? IconButton(
                                        padding: EdgeInsets.zero,
                                        onPressed: () async {
                                            bool? isApproved = await Navigator.push(
                                              context,
                                              PageRouteBuilder(
                                                opaque: false,
                                                barrierDismissible: false,
                                                pageBuilder: (context, _, __) => ApproveScreen(
                                                  title: widget.replyId == null
                                                    ? BenekStringHelpers.locale('approveCommentDelete')
                                                    : BenekStringHelpers.locale('approveReplyDelete'),
                                                ),
                                              ),
                                            );

                                            if(isApproved == null || !isApproved){
                                              return;
                                            }

                                            Store<AppState> store = StoreProvider.of<AppState>(context);
                                            await store.dispatch(deleteStoryCommentOrReplyRequestAction(widget.storyId, widget.commentId, widget.replyId));
                                        },
                                        icon: const Icon(
                                          Icons.delete_outline,
                                          color: AppColors.benekWhite,
                                          size: 15,
                                        ),
                                    )
                                    : const SizedBox(),
                              ],
                            ),

                            widget.isSelectedComment
                              ? const Divider(color: AppColors.benekGrey)
                              : const SizedBox(height: 10.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    widget.replyId == null
                                      ? Text(
                                        '${comment.replyCount} ${BenekStringHelpers.locale('reply')}',
                                        style: regularTextWithoutColorStyle().copyWith(
                                          color: AppColors.benekGrey,
                                          fontSize: 12.0,
                                        ),
                                      ) : const SizedBox(),
                                    widget.replyId == null
                                      ? Text(
                                        '  |  ',
                                        style: regularTextWithoutColorStyle().copyWith(
                                          color: AppColors.benekGrey,
                                          fontSize: 12.0,
                                        ),
                                      ) : const SizedBox(),
                                    Text(
                                      '${comment.likeCount} ${BenekStringHelpers.locale('like')}',
                                      style: regularTextWithoutColorStyle().copyWith(
                                        color: AppColors.benekGrey,
                                        fontSize: 12.0,
                                      ),
                                    ),
                                  ],
                                ),
                                widget.isSelectedComment
                                  ? Text(
                                    BenekStringHelpers.getDateAsString(comment.createdAt!),
                                    style: regularTextWithoutColorStyle().copyWith(
                                      color: AppColors.benekGrey,
                                      fontSize: 12.0,
                                    ),
                                  ) : const SizedBox(),
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
        )
            : const SizedBox();
      },
    );
  }
}
