import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/data/models/log_models/log_model.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../../../../common/constants/app_colors.dart';

class UserIdLogPreviewWidget extends StatelessWidget {
  final double height;
  final double width;
  final List<LogModel> logData;

  const UserIdLogPreviewWidget({
    super.key,
    this.height = 350,
    this.width = 350,
    required this.logData
  });

  @override
  Widget build(BuildContext context) {

    // Count Logs by Date
    Map<String, int> logCountByDate = {};

    for (var log in logData) {
      if (log.date != null) {
        String date = DateFormat('yyyy-MM-dd HH').format(log.date!);
        if (logCountByDate.containsKey(date)) {
          logCountByDate[date] = logCountByDate[date]! + 1;
        } else {
          logCountByDate[date] = 1;
        }
      }
    }

    List<FlSpot> spots = [];
    int index = 0;
    logCountByDate.forEach((date, count) {
      spots.add(FlSpot(index.toDouble(), count.toDouble()));
      index++;
    });

    return Padding(
      padding: const EdgeInsets.only( right: 40.0 ),
      child: Container(
        width: width,
        height: height,
        padding: const EdgeInsets.symmetric(horizontal: 25.0, vertical: 30.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlackWithOpacity,
          borderRadius: BorderRadius.circular(5.0),
        ),
        child: spots.length > 1
        ? LineChart(
          LineChartData(
            gridData: const FlGridData(show: true),
            titlesData: FlTitlesData(
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 40,
                  getTitlesWidget: (value, meta) {
                    int index = value.toInt();
                    if (index >= 0 && index < logCountByDate.keys.length) {
                      String date = logCountByDate.keys.elementAt(index);
                      return Padding(
                        padding: const EdgeInsets.only(top: 30.0),
                        child: Transform.rotate(
                          angle: - 45,
                          child: Text(
                              '$date:00',
                              style: regularTextWithoutColorStyle( textFontSize: 8.0 ),
                          ),
                        ),
                      );
                    }
                    return const Text('');
                  },
                ),
              ),
              leftTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 30,
                  getTitlesWidget: (value, meta) {
                    return Text(
                      BenekStringHelpers.formatNumberToReadable(value.toInt()),
                      style: regularTextWithoutColorStyle( textFontSize: 8.0 ),
                    );
                  },
                ),
              ),
              rightTitles: const AxisTitles(
                sideTitles: SideTitles(showTitles: false),
              ),
              topTitles: const AxisTitles(
                sideTitles: SideTitles(showTitles: false),
              ),
            ),
            borderData: FlBorderData(
              show: true,
              border: const Border(
                left: BorderSide(color: AppColors.benekGrey, width: 2),
                bottom: BorderSide(color: AppColors.benekGrey, width: 2),
              ),
            ),
            lineBarsData: [
              LineChartBarData(
                spots: spots,
                isCurved: true,
                barWidth: 1,
                color: AppColors.benekWhite,
                dotData: const FlDotData(show: false),
              ),
            ],
            lineTouchData: LineTouchData(
              touchTooltipData: LineTouchTooltipData(
                getTooltipColor: (spot) => AppColors.benekBlack,
                getTooltipItems: (touchedSpots) {
                  return touchedSpots.map((touchedSpot) {
                    final date = logCountByDate.keys.elementAt(touchedSpot.x.toInt());
                    return LineTooltipItem(
                      '$date:00 / ${touchedSpot.y.toInt()}',
                      regularTextStyle(
                        textColor: AppColors.benekWhite,
                        textFontSize: 10.0,
                      ),
                    );
                  }).toList();
                },
              ),
            ),
          ),
        )
        : Center(
          child: Text(
            '${logCountByDate.keys.elementAt(0)}:00 / ${logCountByDate.values.elementAt(0)} logs',
            style: regularTextStyle( textColor: AppColors.benekWhite ),
          ),
        ),
      ),
    );
  }
}
