import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class BackgroundVideoWidget extends StatefulWidget {
  const BackgroundVideoWidget({super.key});

  @override
  State<BackgroundVideoWidget> createState() => _BackgroundVideoWidgetState();
}

class _BackgroundVideoWidgetState extends State<BackgroundVideoWidget> with WidgetsBindingObserver {
  late VideoPlayerController _controller;
  bool _isReversing = false;
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeVideo();
  }

  void _initializeVideo() async {
    _controller = VideoPlayerController.asset('assets/videos/background_video.mp4');

    try {
      await _controller.initialize();
      _controller.setLooping(false);
      _controller.setVolume(0.0);
      _controller.addListener(_videoListener);

      setState(() {
        _isInitialized = true;
      });

      _controller.play();
    } catch (e) {
      // Init başarısızsa hata gösterme, siyah ekran olur
      debugPrint("Video init error: $e");
    }
  }

  void _videoListener() async {
    if (!_controller.value.isInitialized) return;

    if (_controller.value.position >= _controller.value.duration && !_isReversing) {
      _isReversing = true;
      await _controller.pause();
      _playInReverse();
    } else if (_controller.value.position.inMilliseconds <= 0 && _isReversing) {
      _isReversing = false;
      await _controller.pause();
      _controller.play();
    }
  }

  void _playInReverse() {
    const frameDuration = Duration(milliseconds: 33);
    Future.doWhile(() async {
      if (!_isReversing || !_controller.value.isInitialized) return false;

      final current = _controller.value.position;
      final newPosition = current - frameDuration;

      if (newPosition.inMilliseconds <= 0) {
        _controller.seekTo(Duration.zero);
        return false;
      }

      _controller.seekTo(newPosition);
      await Future.delayed(frameDuration);
      return true;
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _controller.removeListener(_videoListener);
    _controller.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // Hot restart/refresh veya app pause/resume olduğunda video yeniden başlasın
    if (state == AppLifecycleState.resumed && _isInitialized && !_controller.value.isPlaying) {
      _controller.play();
    }
  }

  @override
  Widget build(BuildContext context) {
    return _isInitialized
        ? SizedBox.expand(
            child: FittedBox(
              fit: BoxFit.cover,
              child: SizedBox(
                width: _controller.value.size.width,
                height: _controller.value.size.height,
                child: VideoPlayer(_controller),
              ),
            ),
          )
        : const ColoredBox(
            color: Colors.black,
            child: SizedBox.expand(),
          );
  }
}