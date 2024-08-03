import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/common/widgets/benek_like_button/like_buton.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../data/models/content_models/comment_model.dart';
import '../../../../presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import '../../../constants/app_colors.dart';

class CommentCardWidget extends StatefulWidget {
  final int index;
  final int indexOfLastRevealedItem;
  final CommentModel comment;
  final void Function()? onAnimationComplete;

  const CommentCardWidget({
    super.key,
    required this.index,
    required this.indexOfLastRevealedItem,
    required this.comment,
    this.onAnimationComplete,
  });

  @override
  State<CommentCardWidget> createState() => _CommentCardWidgetState();
}

class _CommentCardWidgetState extends State<CommentCardWidget> {
  bool startAnimation = false;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      setState(() {
        startAnimation = true;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    int indexForAnimationDuration = widget.index - widget.indexOfLastRevealedItem;

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.benekBlack,
          borderRadius: BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        child: AnimatedContainer(
          duration: Duration(milliseconds: 300 + ((indexForAnimationDuration * 10) + 100)),
          transform: widget.indexOfLastRevealedItem < widget.index
              ? Matrix4.translationValues(startAnimation ? 0 : screenWidth, 0, 0)
              : null,
          onEnd: () {
            if (widget.onAnimationComplete != null) {
              widget.onAnimationComplete!();
            }
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BenekCircleAvatar(
                imageUrl: widget.comment.user!.profileImg!.imgUrl!,
                width: 30.0,
                height: 30.0,
                isDefaultAvatar: widget.comment.user!.profileImg!.isDefaultImg!,
                bgColor: AppColors.benekWhite,
                borderWidth: 2.0,
              ),
              const SizedBox(width: 10.0,),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      widget.comment.user!.userName!,
                      style: semiBoldTextWithoutColorStyle()
                    ),
                    const SizedBox( height: 2.0,),
                    Text(
                      widget.comment.comment!,
                      style: regularTextWithoutColorStyle()
                    ),
                  ],
                ),
              ),
              LikeButton(
                size: 20.0,
                isLiked: false,
                likeBuilder: (isLiked) {
                  return Icon(
                    isLiked ? Icons.favorite : Icons.favorite_border,
                    color: isLiked ? AppColors.benekRed : AppColors.benekGrey,
                    size: 20,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}