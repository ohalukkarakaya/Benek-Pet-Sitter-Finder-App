import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek_kulube/presentation/shared/screens/user_search_screen.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:redux/redux.dart';

import 'home_screen_tabs_bar_companents/home_screen_tabs_bar.dart';

class HomeScreenGrid extends StatelessWidget {
  final Store<AppState> store;
  const HomeScreenGrid({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          HomeScreenTabsBar( store: store,),
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Padding(
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
                          color: Colors.black.withOpacity(0.2),
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
              ),
              const SizedBox( height: 100,),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      const Text(
                        "Hoş Geldin",
                        style: TextStyle(
                          fontFamily: 'Qanelas',
                          fontSize: 30.0,
                          fontWeight: FontWeight.w100
                        ),
                      ),
                      Text(
                        " ${store.state.userInfo!.identity?.firstName} ${store.state.userInfo!.identity?.middleName} ${store.state.userInfo!.identity?.lastName?.toUpperCase()}",
                        style: const TextStyle(
                          fontFamily: 'Qanelas',
                          fontSize: 30.0,
                          fontWeight: FontWeight.w400
                        ),
                      ),
                    ],
                  ),
              
                  const SizedBox(height: 10.0),
        
                  const Text(
                    "Giriş yapmak için aşağıdaki kodu Benek uygulamasına okut.",
                    style: TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 15.0,
                      fontWeight: FontWeight.w400
                    ),
                  ),
        
                  const SizedBox(height: 40.0),
        
                  Text(
                    store.state.loginQrCodeData.expireTime == null 
                    || store.state.loginQrCodeData.expireTime!.isBefore(DateTime.now()) 
                      ? "Yeni bi QR kod almak için butona tıkla :)"
                      : "Bu kodun süresi, bir saat içinde dolar!",
                    style: const TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 12.0,
                      fontWeight: FontWeight.w400
                    ),
                  ),
                ],
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 40.0, top: 5),
                child: BenekCircleAvatar(
                  width: 50,
                  height: 50,
                  radius: 100,
                  isDefaultAvatar: store.state.userInfo!.profileImg!.isDefaultImg!,
                  imageUrl: store.state.userInfo!.profileImg!.imgUrl!,
                )
              ),
              Image.asset(
                'assets/images/saluting_dog.png',
                width: 350,
              ),
            ],
          ),
        ],
      );
  }
}