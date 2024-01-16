import 'package:flutter/material.dart';

class TabsButonElement extends StatelessWidget {
  final IconData icon;
  final String title;
  final Function()? onTapFunction;
  
  const TabsButonElement({super.key, required this.icon, required this.title, this.onTapFunction});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTapFunction,
      child: Row(
        children: [
          Icon(icon, size: 20.0,),
          const SizedBox( width: 20,),
          Text(
            title,
            style: const TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 15.0,
              fontWeight: FontWeight.w400
            ),
          )
        ],
      )
    );
  }
}