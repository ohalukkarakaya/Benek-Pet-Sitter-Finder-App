import 'package:benek/common/widgets/benek_horizontal_button.dart';
import 'package:benek/presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_default_avatar.dart';
import 'package:benek/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:benek/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:flutter/material.dart';
import 'package:flutter/material.dart';

import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek/store/app_state.dart';

import '../../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../../common/utils/parse_default_avatar_url.dart';
import '../../../../../../../../../common/widgets/approve_screen.dart';
import '../../../../../../../../../data/models/default_avatar_url_model.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../../../../../../store/actions/app_actions.dart';

class EditProfileImageScreen extends StatefulWidget {
  const EditProfileImageScreen({super.key});

  @override
  State<EditProfileImageScreen> createState() => _EditProfileImageScreenState();
}

class _EditProfileImageScreenState extends State<EditProfileImageScreen> {
  String imagePath = '';
  bool isIconHovered = false;
  bool isLoading = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    Store<AppState> store = StoreProvider.of<AppState>(context);
    imagePath = ImageVideoHelpers.getFullUrl(store.state.userInfo!.profileImg!.imgUrl!);
  }

  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = StoreProvider.of<AppState>(context);
    UserInfo userInfo = store.state.userInfo!;
    bool isNetWorkImage = !(userInfo.profileImg!.isDefaultImg!);

    DefaultAvatarUrl? defaultAvatarUrlObject;
    if( userInfo.profileImg!.isDefaultImg! ){
      defaultAvatarUrlObject = parseDefaultAvatarUrl(userInfo.profileImg!.imgUrl!);
    }

    double generalWidth = 250;

    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () {
        Navigator.of(context).pop();
      },
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 260.0),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Stack(
                  children: [
                    Container(
                      width: generalWidth,
                      height: generalWidth,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(6.0),
                        border: Border.all(
                          color: Colors.white,
                          width: 4.0,
                        ),
                        image: isNetWorkImage
                        ? DecorationImage(
                            image: NetworkImage(
                                imagePath,
                                headers: { "private-key": dotenv.env['MEDIA_SERVER_API_KEY']! },
                            ),
                            fit: BoxFit.cover,
                          )
                        : null
                      ),
                      child: !isNetWorkImage
                        ? BenekDefaultAvatar(
                          backgroundImagePath: defaultAvatarUrlObject!.backgroundPath,
                          avatarImagePath: defaultAvatarUrlObject.avatarPath,
                          width: generalWidth,
                          height: generalWidth,
                          borderRadius: 0.0,
                          isPet: userInfo.profileImg!.imgUrl!.startsWith('P/'),
                        )
                        : null,
                    ),

                    isLoading
                    ? const Positioned(
                        top: 100,
                        left: 100,
                        child: BenekProcessIndicator(
                          width: 50,
                          height: 50,
                          color: AppColors.benekWhite,
                        ),
                      )
                    : const SizedBox(),
                  ],
                ),

                const SizedBox(height: 20.0,),

                SizedBox(
                  width: generalWidth,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      GestureDetector(
                        onTap: () async {
                          bool didApprove = false;
                          if( !isNetWorkImage ) return;
                          didApprove = await Navigator.push(
                            context,
                            PageRouteBuilder(
                              opaque: false,
                              barrierDismissible: false,
                              pageBuilder: (context, _, __) => ApproveScreen(title: BenekStringHelpers.locale('approveProfilePhotoDelete')),
                            ),
                          );

                          if(didApprove != true) return;

                          setState(() {
                            isLoading = true;
                          });

                          await store.dispatch(updateProfileImageRequestAction(null));
                          Navigator.of(context).pop(store.state.userInfo!.profileImg);
                        },
                        child: MouseRegion(
                          cursor: isNetWorkImage ? SystemMouseCursors.click: SystemMouseCursors.basic,
                          onHover: (_) {
                            if( !isNetWorkImage ) return;
                            setState(() {
                              isIconHovered = true;
                            });
                          },
                          onExit: (_) {
                            setState(() {
                              isIconHovered = false;
                            });
                          },
                          child: Padding(
                            padding: const EdgeInsets.only(right: 20.0),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 15.0),
                              decoration: BoxDecoration(
                                color: !isIconHovered
                                    ? AppColors.benekWhite.withAlpha((0.1 * 255).toInt())
                                    : AppColors.benekRed,
                                borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                              ),
                              child: const Icon(
                                Icons.delete_outline,
                                color: AppColors.benekWhite,
                                size: 20,
                              ),
                            ),
                          ),
                        ),
                      ),

                      BenekHorizontalButton(
                          text: BenekStringHelpers.locale('uploadNewOne'),
                          isLight: true,
                          width: 180.0,
                          onTap: () async {
                            String? newImagePath = await ImageVideoHelpers.pickFile(['jpg', 'jpeg']);
                            if( newImagePath == null ) return;

                            setState(() {
                              isLoading = true;
                            });

                            await store.dispatch(updateProfileImageRequestAction(newImagePath));

                            Navigator.of(context).pop(store.state.userInfo!.profileImg);
                          }
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}