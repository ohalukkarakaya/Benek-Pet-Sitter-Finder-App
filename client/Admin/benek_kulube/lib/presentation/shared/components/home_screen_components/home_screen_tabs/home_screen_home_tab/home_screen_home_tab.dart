import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/widgets/benek_time_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_buttons/home_screen_buton_widget.dart';
import 'package:flutter/material.dart';

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

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const BenekTime(
          timeFontSize: 90.0,
        ),
    
        const SizedBox(height: 30.0),

        const SizedBox(
          height: 200,
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                HomeScreenButon(),
                SizedBox( width: 20 ),
                HomeScreenButon(),
                SizedBox( width: 20 ),
                HomeScreenButon(),
                SizedBox( width: 20 ),
                HomeScreenButon(),
              ],
            ),
          ),
        ),

        const SizedBox(height: 150.0),

        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            const Text(
              "Hoş Geldin",
              style: TextStyle(
                fontFamily: 'Qanelas',
                fontSize: 15.0,
                fontWeight: FontWeight.w100
              ),
            ),
            Text(
              " ${BenekStringHelpers.getUsersFullName(firstName, lastName, middleName)}",
              style: const TextStyle(
                fontFamily: 'Qanelas',
                fontSize: 15.0,
                fontWeight: FontWeight.w400
              ),
            ),
          ],
        ),
      ],
    );
  }
}