import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

import 'package:benek_kulube/common/widgets/approve_screen.dart';
import 'package:benek_kulube/common/widgets/story_context_component/comments_component/edit_comment_components/edit_comment_screen.dart';
import 'package:benek_kulube/redux/like_story_comment/like_story_comment.action.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/common/widgets/benek_like_button/like_buton.dart';
import 'package:benek_kulube/data/models/content_models/comment_model.dart';
import 'package:benek_kulube/data/models/story_models/story_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek_kulube/redux/delete_story_comment_or_reply/delete_story_comment_or_reply.action.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';

import '../../../constants/app_colors.dart';
import '../../../constants/benek_icons.dart';
import '../../../utils/benek_string_helpers.dart';
import 'last_three_comment_replier_profile_stack_widget.dart';

class CommentCardWidget extends StatefulWidget {
  final bool isSelectedComment;
  final Function()? selectCommentFunction;
  final Function()? resetSelectedCommentFunction;
  final String? replyId;
  final String commentId;
  final String storyId;

  const CommentCardWidget({
    Key? key,
    this.isSelectedComment = false,
    this.selectCommentFunction,
    this.resetSelectedCommentFunction,
    this.replyId,
    required this.commentId,
    required this.storyId,
  }) : super(key: key);

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
    _previousCommentsCount ??= _getCommentCount();
  }

  @override
  void didUpdateWidget(CommentCardWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    _updateCommentData();
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _updateTextHeight());
  }

  void _updateCommentData() {
    final commentCount = _getCommentCount();
    final currentComment = _getCurrentComment();

    if (commentCount != _previousCommentsCount) {
      _previousCommentsCount = commentCount;
      _updateTextHeight();
    }

    if (_previousComment != currentComment) {
      _updateTextHeight();
    }

    _previousComment = currentComment;
  }

  CommentModel? _getCurrentComment() {
    final store = StoreProvider.of<AppState>(context);
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
  }

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
      final renderBox = _textKey.currentContext?.findRenderObject() as RenderBox?;
      setState(() {
        textHeight = renderBox?.size.height;
      });
    });
  }

  Future<bool?> onCommentLikeButtonTapped(bool didLiked) async {
    final store = StoreProvider.of<AppState>(context);
    await store.dispatch(likeStoryCommentOrReplyRequestAction(widget.storyId, widget.commentId, widget.replyId));

    setState(() {});

    return !didLiked;
  }

  Widget _buildAvatarColumn(CommentModel comment) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Column(
          mainAxisAlignment:
          widget.isSelectedComment ? MainAxisAlignment.start : MainAxisAlignment.spaceBetween,
          children: [
            if (widget.isSelectedComment)
              IconButton(
                onPressed: widget.resetSelectedCommentFunction,
                icon: const Icon(
                  BenekIcons.left,
                  color: AppColors.benekWhite,
                  size: 14,
                ),
              ),
            SizedBox(height: widget.isSelectedComment ? 10.0 : 0.0),
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
                      height: textHeight != null ? textHeight! + 30 : 35,
                    ),
                    if (comment.lastThreeRepliedUsers != null
                        && comment.lastThreeRepliedUsers!.isNotEmpty
                        && !widget.isSelectedComment)
                      LastThreeCommentReplierProfileStackWidget(
                        size: 30.0,
                        users: comment.lastThreeRepliedUsers!,
                      ),
                  ],
                ),
                if (comment.lastThreeRepliedUsers != null
                    && comment.lastThreeRepliedUsers!.isNotEmpty
                    && !widget.isSelectedComment)
                  Positioned(
                    top: 40,
                    bottom: 40,
                    left: 15,
                    child: Container(
                      width: 1.0,
                      color: AppColors.benekGrey,
                      height: constraints.maxHeight,
                    ),
                  ),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _buildCommentDetails(CommentModel comment, bool isLiked, bool isCommentBelongsToUser) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!widget.isSelectedComment)
            Row(
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
            ),
          SizedBox(height: !widget.isSelectedComment ? 4.0 : 0.0),
          GestureDetector(
            onTap: widget.selectCommentFunction,
            child: ConstrainedBox(
              key: _textKey,
              constraints: const BoxConstraints(
                maxHeight: 100.0,
              ),
              child: SingleChildScrollView(
                child: Text(
                  widget.replyId == null
                      ? comment.comment!
                      : comment.reply!,
                  style: regularTextWithoutColorStyle().copyWith(
                    color: AppColors.benekWhite,
                  ),
                ),
              ),
            ),
          ),
          SizedBox(height: 4.0),
          _buildCommentActions(comment, isLiked, isCommentBelongsToUser),

          widget.isSelectedComment
              ? const Padding(
                padding: EdgeInsets.symmetric( vertical: 5.0),
                child: Divider(color: AppColors.benekGrey),
              )
              : const SizedBox(height: 10.0),

          _buildLikesAndRepliesRow(comment, isLiked),
        ],
      ),
    );
  }

  Widget _buildCommentActions(CommentModel comment, bool isLiked, bool isCommentBelongsToUser) {
    return Padding(
      padding: const EdgeInsets.only(top: 10.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [

          widget.replyId == null
          && !widget.isSelectedComment
              ? Padding(
                padding: const EdgeInsets.only(top: 5.0),
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    onTap: widget.replyId == null ? widget.selectCommentFunction : null,
                    child: const Icon(
                      Icons.chat_bubble_outline,
                      color: AppColors.benekWhite,
                      size: 15,
                    ),
                  ),
                ),
              )
              : const SizedBox(),

          SizedBox(width: widget.replyId == null && !widget.isSelectedComment ? 15.0 : 0.0),
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: LikeButton(
              size: 15.0,
              isLiked: isLiked,
              onTap: onCommentLikeButtonTapped,
              likeBuilder: (isLiked) {
                return Center(
                  child: Icon(
                    isLiked ? Icons.favorite : Icons.favorite_border,
                    color: isLiked ? AppColors.benekRed : AppColors.benekWhite,
                    size: 17,
                  ),
                );
              },
            ),
          ),
          SizedBox(width: isCommentBelongsToUser ? 20.0 : 0.0),
          isCommentBelongsToUser
              ? Padding(
                padding: const EdgeInsets.only(top: 5.0),
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    onTap: () async {
                      await Navigator.push(
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

                      _updateTextHeight();
                    },
                    child: const Icon(
                      Icons.edit_note_outlined,
                      color: AppColors.benekWhite,
                      size: 18,
                    ),
                  ),
                ),
              )
              : const SizedBox(),

          SizedBox(width: isCommentBelongsToUser ? 10.0 : 0.0),

          isCommentBelongsToUser
              ? Padding(
                padding: const EdgeInsets.only(top: 5.0),
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                            onTap: () async {
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
                            child: const Icon(
                  Icons.delete_outline,
                  color: AppColors.benekWhite,
                  size: 15,
                            ),
                          ),
                ),
              )
              : const SizedBox(),
        ],
      ),
    );
  }

  Widget _buildUserCommentActions( CommentModel comment ){
    return Row(
      children: [
        IconButton(
          onPressed: () => _navigateToEditCommentScreen( comment ),
          icon: const Icon(
            Icons.edit,
            size: 20,
            color: AppColors.benekWhite,
          ),
        ),
        IconButton(
          onPressed: () => _showDeleteConfirmation(),
          icon: const Icon(
            Icons.delete,
            size: 20,
            color: AppColors.benekWhite,
          ),
        ),
      ],
    );
  }

  Widget _buildLikesAndRepliesRow(CommentModel comment, bool isLiked) {
    return Row(
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
    );
  }

  void _navigateToEditCommentScreen( CommentModel comment) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EditCommentScreen(
          storyId: widget.storyId,
          commentId: widget.commentId,
          replyId: widget.replyId,
          textToEdit: widget.replyId == null ? comment.comment! : comment.reply!,
        ),
      ),
    );
  }

  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (context) => ApproveScreen(
        title: widget.replyId == null
            ? BenekStringHelpers.locale('approveCommentDelete')
            : BenekStringHelpers.locale('approveReplyDelete'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, CommentModel?>(
      converter: (store) => _getCurrentComment(),
      builder: (context, comment) {
        if (comment == null) return SizedBox();

        final store = StoreProvider.of<AppState>(context);
        final isCommentBelongsToUser = comment.user?.userId == store.state.userInfo?.userId;
        final isLiked = comment.didUserLiked ?? false;

        return Padding(
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
                      _buildAvatarColumn(comment),
                      const SizedBox(width: 10.0),
                      _buildCommentDetails(comment, isLiked, isCommentBelongsToUser),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
