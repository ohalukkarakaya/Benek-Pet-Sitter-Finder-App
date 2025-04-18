import 'package:benek_kulube/common/widgets/report_context_components/report_context_loading_widget.dart';
import 'package:benek_kulube/common/widgets/report_context_components/report_context_widget.dart';
import 'package:benek_kulube/data/models/care_give_models/report_model.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

class ReportContextVerticalScrollWidget extends StatefulWidget {
  final double width;
  final double height;

  const ReportContextVerticalScrollWidget({
    super.key,
    required this.width,
    required this.height,
  });

  @override
  State<ReportContextVerticalScrollWidget> createState() => _ReportContextVerticalScrollWidgetState();
}

class _ReportContextVerticalScrollWidgetState extends State<ReportContextVerticalScrollWidget> {
  late PageController _controller;

  @override
  void initState() {
    super.initState();
    _controller = PageController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _ReportContextViewModel>(
      distinct: true,
      converter: (store) {
        return _ReportContextViewModel(
          selectedIndex: store.state.reports?.selectedReportIndex ?? 0,
          reports: store.state.reports?.reports ?? [],
        );
      },
      onDidChange: (prev, curr) {
        if (prev?.selectedIndex != curr.selectedIndex) {
          _controller.animateToPage(
            curr.selectedIndex,
            duration: const Duration(milliseconds: 500),
            curve: Curves.easeInOut,
          );
        }
      },
      builder: (context, vm) {
        if (vm == null || vm.reports == null ||  vm.reports.isEmpty) {
          return ReportContextLoadingWidget(
            width: widget.width,
            height: widget.height,
          );
        }

        return SizedBox(
          width: widget.width,
          height: widget.height,
          child: PageView.builder(
            controller: _controller,
            scrollDirection: Axis.vertical,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: vm.reports.length,
            itemBuilder: (context, index) {
              final report = vm.reports[index];
              return Padding(
                padding: EdgeInsets.only(bottom: index != vm.reports.length - 1 ? 15.0 : 0.0),
                child: ReportContextWidget(
                  report: report
                )
              );
            },
          ),
        );
      },
    );
  }
}

class _ReportContextViewModel {
  final int selectedIndex;
  final List<ReportModel> reports;

  _ReportContextViewModel({
    required this.selectedIndex,
    required this.reports,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
          other is _ReportContextViewModel &&
              runtimeType == other.runtimeType &&
              selectedIndex == other.selectedIndex &&
              reports == other.reports;

  @override
  int get hashCode => selectedIndex.hashCode ^ reports.hashCode;
}