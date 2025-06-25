import 'dart:async';

import 'package:benek/common/utils/benek_date_time_helpers.dart';
import 'package:flutter/material.dart';

import '../utils/styles.text.dart';

class BenekTime extends StatefulWidget {
  final double timeFontSize;
  final double dateFontSize;
  const BenekTime({
    super.key,
    this.timeFontSize = 30.0,
    this.dateFontSize = 20.0
  });

  @override
  State<BenekTime> createState() => _BenekTimeState();
}

class _BenekTimeState extends State<BenekTime> {
  late Map<String, dynamic> currentTime;
  late Timer timer;

  @override
  void initState() {
    // İlk değeri al ve güncelleme timer'ını başlat
    currentTime = BenekDateTimeHelpers.getCurrentDateTime();
    timer = Timer.periodic(const Duration(seconds: 1), (Timer t) {
      updateCurrentTime();
    });
    super.initState();
  }
  
  void updateCurrentTime() {
    // Saat ve dakikayı güncelle ve setState ile widget'ı yeniden çiz
    setState(() {
      currentTime = BenekDateTimeHelpers.getCurrentDateTime();
    });
  }

  @override
  void dispose() {
    // Timer'ı kapat
    timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              currentTime['hour'],
              style: ultraLightTextWithoutColorStyle( textFontSize: widget.timeFontSize ),
            ),
            Text(
              " : ${currentTime['minute']}",
              style: regularTextWithoutColorStyle( textFontSize: widget.timeFontSize ),
            ),
          ],
        ),
        const SizedBox(height: 5.0),
        Padding(
          padding: const EdgeInsets.only(left:8.0),
          child: Row(
            children: [
              Text(
                "${currentTime['day']} ${currentTime['month']} ",
                style: ultraLightTextWithoutColorStyle( textFontSize: widget.dateFontSize ),
              ),
              Text(
                "${currentTime['dayOfWeek']}",
                style: regularTextWithoutColorStyle( textFontSize: widget.dateFontSize )
              ),
            ],
          ),
        ),
      ],
    );
    
  }
}