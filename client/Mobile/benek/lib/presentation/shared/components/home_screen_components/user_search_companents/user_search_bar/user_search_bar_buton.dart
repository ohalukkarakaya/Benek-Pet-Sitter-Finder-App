import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/presentation/shared/screens/user_search_screen.dart';
import 'package:flutter/material.dart';

class KulubeSearchBarButon extends StatelessWidget {
  final bool shouldGivePaddingToTop;

  const KulubeSearchBarButon({
    super.key,
    this.shouldGivePaddingToTop = true,
  });

  void _onTap(BuildContext context) async {
    await Navigator.push(
      context,
      PageRouteBuilder(
        opaque: false,
        barrierDismissible: false,
        pageBuilder: (context, _, __) => const KulubeUserSearchScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double buttonWidth = screenWidth > 500 ? 450 : screenWidth * 0.9; // mobilde responsive
    double leftPadding = screenWidth > 500 ? 150.0 : 20.0;

    return Padding(
      padding: EdgeInsets.only(top: shouldGivePaddingToTop ? 45.0 : 0, left: leftPadding, right: 20.0),
      child: GestureDetector(
        onTap: () => _onTap(context),
        child: Hero(
          tag: 'user_search_text_field',
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
          child: Container(
            height: 45,
            width: buttonWidth,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.all(Radius.circular(5.0)),
              color: AppColors.benekBlack.withAlpha(51), // 0.2 * 255 ≈ 51
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: Text(
                      BenekStringHelpers.locale('searchAUser'),
                      style: planeTextStyle(),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Icon(BenekIcons.searchcircle, size: 20.0),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}