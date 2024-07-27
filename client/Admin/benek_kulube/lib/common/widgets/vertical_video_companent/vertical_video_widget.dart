import 'dart:async';
import 'dart:developer';
import 'dart:io';

import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:video_player/video_player.dart';


import '../../../data/models/user_profile_models/user_info_model.dart';
import '../../../presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:benek_kulube/common/widgets/vertical_video_companent/video_loading_widget.dart'; // Tekrar ekledim

class VerticalContentComponent extends StatefulWidget {
  final String src;
  final UserInfo user;
  final double width;
  final double height;

  const VerticalContentComponent({
    super.key,
    required this.src,
    required this.user,
    required this.width,
    required this.height
  });

  @override
  State<VerticalContentComponent> createState() => _VerticalContentComponentState();
}

class _VerticalContentComponentState extends State<VerticalContentComponent> {

  VideoPlayerController? _videoPlayerController;
  File? _tempFile;
  bool _isPlayerInitialized = false;
  bool _isMuted = false;
  bool _showIcon = false;
  Timer? _hideIconTimer;

  @override
  void initState() {
    super.initState();
    initializePlayer();
  }

  Future<void> initializePlayer() async {

    String? videoFilePath = await ImageVideoHelpers.getVideo(widget.src);

    if (videoFilePath != null) {
      _tempFile = File(videoFilePath);
      _videoPlayerController = VideoPlayerController.file(_tempFile!)
        ..initialize().then((_) {
          setState(() {
            _videoPlayerController?.play();
          });
        });
    } else {
      // Handle error
      log('Error loading video');
    }

    setState(() {
      _isPlayerInitialized = true;
    });

    _videoPlayerController!.setLooping(true);
  }

  @override
  void dispose() {
    _videoPlayerController?.dispose();
    super.dispose();
  }


   void _toggleMute() {
    setState(() {
      _isMuted = !_isMuted;
      _videoPlayerController?.setVolume(_isMuted ? 0.0 : 1.0);
      _showIcon = true;

      // Hide the mute icon after 1 second
      _hideIconTimer?.cancel();
      _hideIconTimer = Timer( const Duration(seconds: 1), () {
        setState(() {
          _showIcon = false;
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: BorderRadius.circular(25.0),
      child: _isPlayerInitialized
        ? Stack(
          children: [
            GestureDetector(
              onTap: _toggleMute,
              child: SizedBox(
                  width: widget.width,
                  height: widget.height,
                  child: FittedBox(
                    fit: BoxFit.cover,
                    child: SizedBox(
                      width: _videoPlayerController!.value.size.width,
                      height: _videoPlayerController!.value.size.height,
                      child: VideoPlayer(_videoPlayerController!),
                    ),
                  ),
                ),
            ),

            _showIcon
                ? Positioned(
                    bottom: 20,
                    right: 20,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        _isMuted ? Icons.volume_off : Icons.volume_up,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),
                  )
                : const SizedBox(),

            Positioned(
              bottom: 20,
              left: 20,
              child: BenekCircleAvatar(
                borderWidth: 2,
                isDefaultAvatar: widget.user.profileImg!.isDefaultImg!,
                imageUrl: widget.user.profileImg!.imgUrl!,
              ),
            ),
          ],
        )
        : Container(
          color: Colors.white,
          child: VideoLoadingWidget(
            width: widget.width,
            height: widget.height,
          ),
        ),
    );
  }
}
