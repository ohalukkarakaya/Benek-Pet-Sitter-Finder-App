import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../../benek_circle_avatar/benek_circle_avatar.dart';

class UploadProfileImageButton extends StatefulWidget {
  final UserInfo userInfo;

  const UploadProfileImageButton({
    super.key,
    required this.userInfo,
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
        onTap: () {},
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
                top: 27.5,
                left: 20,
                child: Container(
                    width: 40,
                    height: 25,
                    decoration: BoxDecoration(
                      color: !isHovered
                          ? AppColors.benekBlack.withOpacity(0.82)
                          : AppColors.benekBlack,
                      borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                    ),
                    child: const Center(
                      child: Icon(
                        BenekIcons.upload,
                        size: 10.0,
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
