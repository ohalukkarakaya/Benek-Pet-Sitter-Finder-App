import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/presentation/shared/screens/user_search_screen.dart';
import 'package:flutter/material.dart';

class KulubeSearchBarButon extends StatelessWidget {
  const KulubeSearchBarButon({super.key});

  void _onTap(BuildContext context) async {
    await Navigator.push(
      context,
      PageRouteBuilder(
        opaque: false,
        barrierDismissible: false,
        pageBuilder: (context, _, __) => const KulubeUserSearchScreen(),
      ),
    );
    // setState çağrısı burada olabilir
  }

  @override
  Widget build(BuildContext context) {
    
    return Padding(
      padding: const EdgeInsets.only(top: 45.0, left: 150.0),
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
            ){
              final Widget heroWidget = flightDirection == HeroFlightDirection.pop
                  ? fromHeroContext.widget
                  : toHeroContext.widget;

              return heroWidget is Hero ? heroWidget : Container();
            },
            child: Container(
              height: 45,
              width: 450,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.all( Radius.circular( 5.0 ) ),
                color: AppColors.benekBlack.withOpacity(0.2),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text( BenekStringHelpers.locale('searchAUser'), style: const TextStyle( fontFamily: 'Qanelas' )),
                    const Icon( BenekIcons.searchcircle, size: 20.0, ),
                  ],
                ),
              ),
            ),
          ),
        ),
    );
  }
}