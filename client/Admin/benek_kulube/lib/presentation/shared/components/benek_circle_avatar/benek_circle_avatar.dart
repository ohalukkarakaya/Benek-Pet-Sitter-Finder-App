import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/parse_default_avatar_url.dart';
import 'package:benek_kulube/data/models/default_avatar_url_model.dart';
import 'package:benek_kulube/presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_default_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class BenekCircleAvatar extends StatefulWidget {
  final bool isDefaultAvatar;
  final String imageUrl;
  final double? width;
  final double? height;
  final double radius;
  final Color? bgColor;
  final double borderWidth;

  const BenekCircleAvatar(
    {
      super.key, 
      required this.isDefaultAvatar, 
      required this.imageUrl, 
      this.width = 40.0, 
      this.height = 40.0, 
      this.radius = 100.0,
      this.bgColor = AppColors.benekWhite,
      this.borderWidth = 4.0
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
      padding: EdgeInsets.all( widget.borderWidth ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all( Radius.circular( widget.radius ) ),
        color: widget.bgColor,
      ),
      child: widget.isDefaultAvatar && !isErrorOccured
              ? BenekDefaultAvatar(
                backgroundImagePath: defaultAvatarUrlObject!.backgroundPath,
                avatarImagePath: defaultAvatarUrlObject!.avatarPath,
                width: widget.width!,
                height: widget.height!,
                borderRadius: widget.radius,
                isPet: widget.imageUrl.startsWith('P/'),
              )
              : !( widget.isDefaultAvatar) && isErrorOccured
                  ? const SizedBox()
                  : ClipRRect(
                    borderRadius: BorderRadius.all( Radius.circular( widget.radius ) ),
                    child: Image.network(
                      '${ImageVideoHelpers.mediaServerBaseUrlHelper()}getAsset?assetPath=${widget.imageUrl}',
                      headers: { "private-key": dotenv.env['MEDIA_SERVER_API_KEY']! },
                      fit: BoxFit.cover,
                    ),
                  )
    );
  }
}