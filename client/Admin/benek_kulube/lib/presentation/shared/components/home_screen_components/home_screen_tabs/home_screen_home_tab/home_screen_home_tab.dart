import 'dart:developer';

import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/common/widgets/benek_time_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_buttons/home_screen_buton_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_home_tab/benek_pricing_page.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

import 'benek_terms_page.dart';

class KulubeHomeTabWidget extends StatelessWidget {
  final String firstName;
  final String? middleName;
  final String lastName;

  const KulubeHomeTabWidget(
    {
      super.key,
      required this.firstName,
      this.middleName,
      required this.lastName
    }
  );

  Future<void> _launchUrl(Uri url) async {
    if( await canLaunchUrl(url) ){
      await launchUrl(url);
    }else{
      log('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    Uri notionUrl = Uri.parse('https://www.notion.so/bd9038a1ceae47b6baf91cfcea5195f3?v=b4effb8fc8eb49dda57fbc5adeae8d04&pvs=4');
    Uri notionDocumentationUrl = Uri.parse('https://www.notion.so/BENEK-Server-API-Documentation-17a17d8c6e1280b8b7afcaf756102972?pvs=4');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const BenekTime(
          timeFontSize: 90.0,
        ),

        const SizedBox(height: 30.0),

        SizedBox(
          height: 200,
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const HomeScreenButon(),
                const SizedBox( width: 20 ),
                HomeScreenButon(
                  icon: FontAwesomeIcons.dollarSign,
                  onTap: () => Navigator.push(
                    context,
                    PageRouteBuilder(
                      opaque: false,
                      barrierDismissible: false,
                      pageBuilder: (context, _, __) => const BenekPricingPage(),
                    ),
                  ),
                ),
                const SizedBox( width: 20 ),
                HomeScreenButon(
                  icon: FontAwesomeIcons.clipboard,
                  onTap: () => Navigator.push(
                    context,
                    PageRouteBuilder(
                      opaque: false,
                      barrierDismissible: false,
                      pageBuilder: (context, _, __) => const BenekTermsPage(),
                    ),
                  ),
                ),
                const SizedBox( width: 20 ),
                HomeScreenButon(
                  icon: FontAwesomeIcons.file,
                  onTap: () => _launchUrl(notionDocumentationUrl),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 150.0),

        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              BenekStringHelpers.locale('welcome'),
              style: ultraLightTextWithoutColorStyle( textFontSize: 15.0 ),
            ),
            Text(
              " ${BenekStringHelpers.getUsersFullName(firstName, lastName, middleName)}",
              style: regularTextWithoutColorStyle( textFontSize: 15.0 ),
            ),
          ],
        ),
      ],
    );
  }
}