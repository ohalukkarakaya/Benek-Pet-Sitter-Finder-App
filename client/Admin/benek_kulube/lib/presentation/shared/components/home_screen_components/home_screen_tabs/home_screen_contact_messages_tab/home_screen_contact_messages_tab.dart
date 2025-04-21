
import 'dart:developer';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_buttons/home_screen_buton_widget.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactMessagesTabWidget extends StatelessWidget {
  const ContactMessagesTabWidget({
    super.key,
  });

  Future<void> _launchUrl(Uri url) async {
    if( await canLaunchUrl(url) ){
      await launchUrl(url);
    }else{
      log('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    Uri geriBildirimUrl = Uri.parse('https://github.com/Benek-App/benek-geri-bildirim/issues');
    Uri gizliGeriBildirimUrl = Uri.parse('https://github.com/Benek-App/benek-gizli-geri-bildirim/issues');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 600,
          height: 130,
          decoration: BoxDecoration(
            color: AppColors.benekBlack.withOpacity(0.2),
            borderRadius: BorderRadius.circular(15),
          ),
          padding: const EdgeInsets.only(left: 30, right: 30, top: 10),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                child: RichText(
                  text: TextSpan(
                    children: [
                      WidgetSpan(
                        child: Padding(
                          padding: const EdgeInsets.only( right: 8.0),
                          child: Icon(
                              Icons.warning,
                              color: AppColors.benekWarningOrange,
                              size: 15
                          ),
                        ),
                      ),
                      TextSpan(
                        text: BenekStringHelpers.locale("contactFormInfo"),
                        style: regularTextStyle(
                          textColor: AppColors.benekWhite,
                          textFontSize: 14.0,
                        ),
                      ),
                    ],
                  ),
                  softWrap: true,
                  maxLines: null,
                  overflow: TextOverflow.visible,
                ),
              ),
            ],
          )
        ),

        const SizedBox(height: 30.0),

        SizedBox(
          height: 200,
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                HomeScreenButon(
                  icon: FontAwesomeIcons.github,
                  onTap: () => _launchUrl(geriBildirimUrl),
                ),
                const SizedBox( width: 20 ),
                HomeScreenButon(
                  icon: FontAwesomeIcons.screwdriverWrench,
                  onTap: () => _launchUrl(gizliGeriBildirimUrl),
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
              BenekStringHelpers.locale("priorityMessageWarning"),
              style: regularTextWithoutColorStyle( textFontSize: 15.0 ),
            ),
          ],
        ),
      ],
    );
  }
}