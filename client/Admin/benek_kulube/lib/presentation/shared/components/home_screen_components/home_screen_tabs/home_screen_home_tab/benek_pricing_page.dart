import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

import '../../../loading_components/benek_blured_modal_barier.dart';
import 'package:flutter/services.dart' show rootBundle;

class BenekPricingPage extends StatelessWidget {
  const BenekPricingPage({super.key});

  Future<String> loadMarkdownAsset() async {
    return await rootBundle.loadString('assets/pricing.md');
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
        future: loadMarkdownAsset(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return const Center(child: Text("Yüklenemedi"));
          } else {
            return ConstrainedBox(
              constraints: const BoxConstraints(
                maxWidth: 600,
                maxHeight: 500,
              ),
              child: Material(
                color: Colors.white.withOpacity(0),
                borderRadius: BorderRadius.circular(16),
                child: BenekBluredModalBarier(
                  isDismissible: true,
                  onDismiss: () {
                    Navigator.of(context).pop();
                  },
                  isLightColor: false,
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          vertical: 24.0,
                          horizontal: 100.0
                      ),
                      child: ScrollConfiguration(
                        behavior: ScrollConfiguration.of(context).copyWith(
                          scrollbars: false,
                          overscroll: false,
                          physics: const BouncingScrollPhysics(),
                        ),
                        child: SingleChildScrollView(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                vertical: 16.0,
                                horizontal: 25
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.benekBlack,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: MarkdownBody(
                              data: snapshot.data!,
                              selectable: true,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            );
          }
        }
    );
  }
}
