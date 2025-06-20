import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:visibility_detector/visibility_detector.dart';

class BenekCustomScrollListWidget extends StatefulWidget {
  final bool isShouldNotBeScrollable; // This Condition Makes Physic to NeverScrollable
  final List<dynamic>? itemDataList; // Data list which you gonna pass to child. Like List of User data extc. 
  final Widget Function(int) child; // Child widget builder. It has to be builder because we need to pass data in it like index
  final void Function(VisibilityInfo visibilityInfo, int index)? onVisibilityChangedCB; // It trigers this function when a widgets visibility gets changed.

  const BenekCustomScrollListWidget({
    Key? key,
    this.isShouldNotBeScrollable = false,
    required this.itemDataList,
    required this.child,
    this.onVisibilityChangedCB,
  }) : super(key: key);

  @override
  State<BenekCustomScrollListWidget> createState() => _BenekCustomScrollListWidgetState();
}

class _BenekCustomScrollListWidgetState extends State<BenekCustomScrollListWidget> with TickerProviderStateMixin {
  late ScrollController _controller;
  var rate = 1.0;
  var old = 0.0;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
  }

   Widget _buildAnimatedPadding( Widget? child ){
    return AnimatedPadding(
      padding: EdgeInsets.only(
        left: 10.0,
        right: 10.0,
        top: _controller.position.userScrollDirection == ScrollDirection.forward
          ? ((rate + 10).abs() > 80.0) ? 80.0 : (rate + 10.0).abs()
          : 10.0,
        bottom: _controller.position.userScrollDirection == ScrollDirection.reverse
          ? ((rate + 10).abs() > 80.0) ? 80.0 : (rate + 10.0).abs()
          : 10.0
      ),
      duration: const Duration(milliseconds: 375),
      curve: Curves.easeOut,
      child: child ?? const SizedBox(),
    );
  }

  Widget _buildVisibilityDetector(Widget child, int index) {
    return VisibilityDetector(
      key: Key(index.toString()),
      onVisibilityChanged: (visibilityInfo) {
        if(widget.onVisibilityChangedCB != null && mounted){
          widget.onVisibilityChangedCB!(visibilityInfo, index);
        }
      },
      child: child,
    );
  }

  @override
  Widget build(BuildContext context) {
    return NotificationListener<ScrollNotification>(
      onNotification: (scrollNotification) {
        var curent = scrollNotification.metrics.pixels;
        var pixels = scrollNotification.metrics.pixels;
        var max = scrollNotification.metrics.maxScrollExtent;
        var min = scrollNotification.metrics.minScrollExtent;

        setState(() {
          if( curent > 10 ){
            rate = (curent - old).abs();
            old = curent;
          }

          if( pixels >= max - 50 ){
            rate = 0.0;
          }

          if( pixels <= min + 50 ){
            rate = 0.0;
          }
        });

        return true;
      },
      child: CustomScrollView(
        physics: widget.isShouldNotBeScrollable
                    ? const NeverScrollableScrollPhysics() 
                    : const BouncingScrollPhysics(),
        controller: _controller,
        slivers: [
          SliverList(
            delegate: SliverChildBuilderDelegate(
              childCount: widget.itemDataList?.length ?? 0,
              (context, index) {
                if(
                  widget.itemDataList != null 
                  && index < widget.itemDataList!.length
                ){
                  return _buildVisibilityDetector(
                    _buildAnimatedPadding(
                      widget.child(index)
                    ),
                    index,
                  );
                } else {
                  return const SizedBox.shrink();
                }
              }
            ),
          )
        ],
      ),
    );
  }
}
