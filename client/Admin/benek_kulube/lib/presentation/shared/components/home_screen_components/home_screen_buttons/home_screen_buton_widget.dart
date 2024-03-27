import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:flutter/material.dart';

class HomeScreenButon extends StatefulWidget {
  final Image? image;
  final String? title;
  final VoidCallback? onTap;

  const HomeScreenButon(
    {
      super.key,
      this.image,
      this.title,
      this.onTap
    }
  );

  @override
  State<HomeScreenButon> createState() => _HomeScreenButonState();
}

class _HomeScreenButonState extends State<HomeScreenButon> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onHover: ( event ){
          if( !isHovering ){
            setState(() {
              isHovering = true;
            });
          }
        },
      onExit: (event) {
        if( isHovering ){
          setState(() {
            isHovering = false;
          });
        }
      },
      child: Container(
        width: 130,
        height: 130,
        decoration: BoxDecoration(
          color: !isHovering ? AppColors.benekBlack.withOpacity(0.2) : AppColors.benekLightBlue,
          borderRadius: BorderRadius.circular(15),
        ),
      ),
    );
  }
}