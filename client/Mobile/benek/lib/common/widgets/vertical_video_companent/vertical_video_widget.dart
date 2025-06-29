import 'dart:async';
import 'dart:io';

import 'package:benek/common/widgets/vertical_video_companent/video_loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';


import '../../../data/models/user_profile_models/user_info_model.dart';
import '../../../presentation/features/image_video_helpers/image_video_helpers.dart';

class VerticalContentComponent extends StatefulWidget {
  final bool isLocalAsset;
  final String src;
  final UserInfo user;
  final double width;
  final double height;
  final bool isCreatingStory;

  const VerticalContentComponent({
    super.key,
    this.isLocalAsset = false,
    required this.src,
    required this.user,
    required this.width,
    required this.height,
    this.isCreatingStory = false,
  });

  @override
  State<VerticalContentComponent> createState() => _VerticalContentComponentState();
}

class _VerticalContentComponentState extends State<VerticalContentComponent> {

  VideoPlayerController? _videoPlayerController;
  String? urlPath;
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
    bool isMp4 = ImageVideoHelpers.isVideo(widget.src);
    String? path = !widget.isCreatingStory
        ? isMp4
          ? await ImageVideoHelpers.getVideo(widget.src)
          : ImageVideoHelpers.getFullUrl(widget.src)
        : widget.src;

    setState(() {
      urlPath = path;
    });

    if (path != null && isMp4) {
      _tempFile = File(path);

      // VideoPlayerController'ı sadece bir kez initialize edin
      if (_videoPlayerController == null) {
        _videoPlayerController = VideoPlayerController.file(_tempFile!)
          ..initialize().then((_) {
            setState(() {
              _videoPlayerController?.play();
              _isPlayerInitialized = true;
            });
          }).catchError((error) {
            // Hata işlemleri
            debugPrint('VideoPlayerController initialization error: $error');
          });

        if (isMp4) {
          _videoPlayerController!.setLooping(true);
        }
      }
    } else {
      setState(() {
        _isPlayerInitialized = true;
      });
    }
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
    bool isMp4 = ImageVideoHelpers.isVideo(widget.src);

    return ClipRRect(
      borderRadius: BorderRadius.circular(0.0),
      child: _isPlayerInitialized || !isMp4
          ? Stack(
        children: [
          GestureDetector(
            onTap: isMp4 ? _toggleMute : null,
            child: SizedBox(
              width: widget.width,
              height: widget.height,
              child: FittedBox(
                fit: BoxFit.cover,
                child: SizedBox(
                  width: isMp4 ? _videoPlayerController!.value.size.width : widget.width,
                  height: isMp4 ? _videoPlayerController!.value.size.height : widget.height,
                  child: isMp4
                      ? VideoPlayer(_videoPlayerController!)
                      : !widget.isLocalAsset
                      ? Image.network(urlPath!, fit: BoxFit.cover)
                      : Image.file(File(urlPath!), fit: BoxFit.cover),
                ),
              ),
            ),
          ),
          _showIcon && isMp4
              ? Positioned(
            bottom: 20,
            right: 20,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.black.withAlpha((0.5 * 255).toInt()),
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