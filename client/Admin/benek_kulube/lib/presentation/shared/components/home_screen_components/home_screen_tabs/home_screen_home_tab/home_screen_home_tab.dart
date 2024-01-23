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
    dynamic  middleNameAsString = middleName != null ? "${middleName!} " : "";
    return Column(
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
              " $firstName $middleNameAsString${lastName.toUpperCase()}",
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

        const Text(
          "Yeni bi QR kod almak için butona tıkla :)",
          style: TextStyle(
            fontFamily: 'Qanelas',
            fontSize: 12.0,
            fontWeight: FontWeight.w400
          ),
        ),
      ],
    );
  }
}