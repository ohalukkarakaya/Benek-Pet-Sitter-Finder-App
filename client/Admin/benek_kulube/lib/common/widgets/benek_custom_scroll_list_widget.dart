import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_result_list/user_search_user_card.dart';
import 'package:flutter/material.dart';

class BenekCustomScrollListWidget extends StatefulWidget {
  final double lastChildHeight;
  final List<UserInfo>? resultData;

  const BenekCustomScrollListWidget({
    Key? key,
    required this.lastChildHeight,
    required this.resultData,
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

  @override
  Widget build(BuildContext context) {
    return NotificationListener<ScrollNotification>(
      onNotification: (scrollNotification) {
        var curent = scrollNotification.metrics.pixels;
        var pixels = scrollNotification.metrics.pixels;
        var max = scrollNotification.metrics.maxScrollExtent;
        var min = scrollNotification.metrics.minScrollExtent;

        setState(() {
          if (curent > 10) {
            rate = (curent - old).abs();
            old = curent;
          }

          if (pixels >= max - 50) {
            rate = 0.0;
          }

          if (pixels <= min + 50) {
            rate = 0.0;
          }
        });

        return true;
      },
      child: CustomScrollView(
        physics: widget.lastChildHeight <= 678.6 ? const NeverScrollableScrollPhysics() : const BouncingScrollPhysics(),
        controller: _controller,
        slivers: [
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                if (widget.resultData != null && index < widget.resultData!.length) {
                  return AnimatedPadding(
                    padding: EdgeInsets.only(
                      left: 10.0,
                      right: 10.0,
                      top: ((rate + 10).abs() > 80.0) ? 80.0 : (rate + 10.0).abs(),
                    ),
                    duration: const Duration(milliseconds: 375),
                    curve: Curves.easeOut,
                    child: KulubeUserCard(
                      resultData: widget.resultData![index],
                    ),
                  );
                } else {
                  return const SizedBox.shrink(); // Veri yoksa boş bir widget döndür
                }
              },
              childCount: widget.resultData?.length ?? 0, // resultData null ise 0 döndür
            ),
          )
        ],
      ),
    );
  }
}
