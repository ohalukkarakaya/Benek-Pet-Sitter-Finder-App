import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

class KulubeUserCard extends StatefulWidget {
  const KulubeUserCard({
    super.key,
    required this.index,
    required this.indexOfLastRevealedItem,
    required this.resultData,
    this.onAnimationComplete,
    this.onUserTapCallback,
  });

  final int index;
  final int indexOfLastRevealedItem;
  final UserInfo resultData;
  final void Function()? onAnimationComplete;
  final Function(UserInfo)? onUserTapCallback; // 🔥 Yeni ekledik

  @override
  State<KulubeUserCard> createState() => _KulubeUserCardState();
}

class _KulubeUserCardState extends State<KulubeUserCard> {
  bool startAnimation = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      setState(() {
        startAnimation = true;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    int indexForAnimationDuration = widget.index - widget.indexOfLastRevealedItem;

    String middleName = widget.resultData.identity!.middleName != null ? "${widget.resultData.identity!.middleName!} " : "";
    String usersFullName = "${widget.resultData.identity!.firstName!} $middleName${widget.resultData.identity!.lastName!}";

    return GestureDetector(
      onTap: () => widget.onUserTapCallback?.call(widget.resultData),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.benekBlack,
          borderRadius: BorderRadius.all(Radius.circular(6.0)),
        ),
        child: AnimatedContainer(
          duration: Duration(milliseconds: 300 + ((indexForAnimationDuration * 10) + 100)),
          transform: widget.indexOfLastRevealedItem < widget.index
              ? Matrix4.translationValues(startAnimation ? 0 : screenWidth, 0, 0)
              : null,
          onEnd: () {
            widget.onAnimationComplete?.call();
          },
          child: ListTile(
            leading: Hero(
              tag: 'user_avatar_${widget.resultData.userId}',
              createRectTween: (begin, end) {
                return RectTween(begin: begin, end: end);
              },
              flightShuttleBuilder: (
                BuildContext flightContext,
                Animation<double> animation,
                HeroFlightDirection flightDirection,
                BuildContext fromHeroContext,
                BuildContext toHeroContext,
              ) {
                final Widget heroWidget = flightDirection == HeroFlightDirection.pop
                    ? fromHeroContext.widget
                    : toHeroContext.widget;
                return heroWidget is Hero ? heroWidget : Container();
              },
              child: BenekCircleAvatar(
                imageUrl: widget.resultData.profileImg!.imgUrl!,
                width: 40.0,
                height: 40.0,
                radius: 20.0,
                isDefaultAvatar: widget.resultData.profileImg!.isDefaultImg!,
                bgColor: AppColors.benekWhite,
              ),
            ),
            title: Row(
              children: [
                Text(
                  "@${widget.resultData.userName!} | ",
                  style: TextStyle(
                    fontFamily: defaultFontFamily(),
                    fontSize: 15.0,
                    fontWeight: getFontWeight('medium'),
                    color: Colors.white,
                  ),
                ),
                Expanded(
                  child: Text(
                    usersFullName,
                    style: TextStyle(
                      fontFamily: defaultFontFamily(),
                      fontSize: 15.0,
                      fontWeight: getFontWeight('light'),
                      color: Colors.white,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            subtitle: Text(
              widget.resultData.identity!.bio ?? '',
              style: TextStyle(
                fontFamily: defaultFontFamily(),
                fontSize: 12.0,
                fontWeight: getFontWeight('regular'),
                color: Colors.white,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ),
      ),
    );
  }
}