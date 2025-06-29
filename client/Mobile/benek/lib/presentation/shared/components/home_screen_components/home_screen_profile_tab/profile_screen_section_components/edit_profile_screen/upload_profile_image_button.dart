import 'dart:ui';

import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../data/models/user_profile_models/user_info_model.dart';

class UploadProfileImageButton extends StatefulWidget {
  final UserInfo userInfo;
  final Function()? onTap;

  const UploadProfileImageButton({
    super.key,
    required this.userInfo,
    this.onTap,
  });

  @override
  State<UploadProfileImageButton> createState() => _UploadProfileImageButtonState();
}

class _UploadProfileImageButtonState extends State<UploadProfileImageButton> {
  bool isHovered = false;
  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onHover: (event) {
        setState(() {
          isHovered = true;
        });
      },
      onExit: (event) {
        setState(() {
          isHovered = false;
        });
      },
      child: GestureDetector(
        onTap: widget.onTap,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(100),
          child: Stack(
            children: [
              const SizedBox(
                width: 80,
                height: 80,
              ),

              BenekCircleAvatar(
                width: 80,
                height: 80,
                radius: 100,
                isDefaultAvatar: widget.userInfo.profileImg!.isDefaultImg!,
                imageUrl: widget.userInfo.profileImg!.imgUrl!,
              ),

              isHovered
                ? Positioned(
                  top: 2.5,
                  left: 2.5,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(100),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(100)
                      ),
                      width: 75,
                      height: 75,
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
                        child: Container(
                          width: 75,
                          height: 75,
                          color: Colors.transparent,
                        ),
                      ),
                    ),
                  ),
                )
                : const SizedBox(),

              Positioned(
                top: 20,
                left: 20,
                child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: !isHovered
                          ? AppColors.benekBlack.withAlpha((0.82 * 255).toInt())
                          : AppColors.benekBlack,
                      borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                    ),
                    child: const Center(
                      child: Icon(
                        FontAwesomeIcons.gear,
                        size: 15.0,
                        color: AppColors.benekWhite,
                      ),
                    )
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
