import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/presentation/shared/screens/user_search_screen.dart';
import 'package:flutter/material.dart';

class KulubeSearchBarButon extends StatelessWidget {
  const KulubeSearchBarButon({super.key});

  @override
  Widget build(BuildContext context) {
    
    return Padding(
      padding: const EdgeInsets.only(left: 150.0),
      child: GestureDetector(
          onTap: () async {
            Navigator.push(
              context,
              PageRouteBuilder(
                opaque: false,
                barrierDismissible: false,
                pageBuilder: (context, _, __) => const KulubeUserSearchScreen(),
              )
            );
          },
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
              width: 500,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.all( Radius.circular( 5.0 ) ),
                color: AppColors.benekBlack.withOpacity(0.2),
              ),
              child: const Padding(
                padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text( "Bir Kullanıcı Ara", style: TextStyle( fontFamily: 'Qanelas' )),
                    Icon( BenekIcons.searchcircle, size: 20.0, ),
                  ],
                ),
              ),
            ),
          ),
        ),
    );
  }
}