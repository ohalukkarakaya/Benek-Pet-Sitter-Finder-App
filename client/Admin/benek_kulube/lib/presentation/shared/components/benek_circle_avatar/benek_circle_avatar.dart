import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/parse_default_avatar_url.dart';
import 'package:benek_kulube/data/models/default_avatar_url_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_default_avatar.dart';
import 'package:flutter/material.dart';

class BenekCircleAvatar extends StatefulWidget {
  final bool isDefaultAvatar;
  final String imageUrl;
  final double? width;
  final double? height;
  final double radius;
  const BenekCircleAvatar(
    {
      super.key, 
      required this.isDefaultAvatar, 
      required this.imageUrl, 
      this.width = 40.0, 
      this.height = 40.0, 
      this.radius = 100.0
    }
  );

  @override
  State<BenekCircleAvatar> createState() => _BenekCircleAvatarState();
}

class _BenekCircleAvatarState extends State<BenekCircleAvatar> {
  @override
  Widget build(BuildContext context) {

    DefaultAvatarUrl? defaultAvatarUrlObject;
    bool isErrorOccured = false;

    if( widget.isDefaultAvatar ){
      setState(() { defaultAvatarUrlObject = parseDefaultAvatarUrl(widget.imageUrl); });
    }

    if( 
      widget.isDefaultAvatar 
      && ( defaultAvatarUrlObject == null || defaultAvatarUrlObject!.isInvalidUrl )
    ){
      setState(() { isErrorOccured = true; });
    }

    return Container(
      height: widget.height,
      width: widget.width,
      padding: const EdgeInsets.all(4.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all( Radius.circular( widget.radius ) ),
        color: AppColors.benekWhite,
      ),
      child: widget.isDefaultAvatar && !isErrorOccured
              ? BenekDefaultAvatar(
                backgroundImagePath: defaultAvatarUrlObject!.backgroundPath,
                avatarImagePath: defaultAvatarUrlObject!.avatarPath,
                width: widget.width!,
                height: widget.height!,
                borderRadius: widget.radius,
              )
              : !( widget.isDefaultAvatar) || isErrorOccured
                  ? const SizedBox()
                  : ClipRRect(
                    borderRadius: BorderRadius.all( Radius.circular( widget.radius ) ),
                    child: Image.network(
                      widget.imageUrl,
                      fit: BoxFit.cover,
                    ),
                  )
    );
  }
}