import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter/services.dart' show rootBundle;

import '../../../loading_components/benek_blured_modal_barier.dart';

class BenekTermsPage extends StatefulWidget {
  const BenekTermsPage({super.key});

  @override
  State<BenekTermsPage> createState() => _BenekTermsPageState();
}

class _BenekTermsPageState extends State<BenekTermsPage> with TickerProviderStateMixin {
  late TabController _tabController;
  final List<String> _tabs = ["Hizmet Sözleşmesi", "KVKK Aydınlatma", "KVKK Açık Rıza",];
  final List<String> _markdownPaths = [
    'assets/benek_hizmet_sozlesmesi.md',
    'assets/kisisel_verilerin_korunması_ kullanici_aydinlatma.md',
    'assets/kisisel_verilerin_korunması_acik_riza_metni_ve_beyani.md',
  ];

  List<String?> _markdownContents = [null, null, null];
  int _selectedTabIndex = 0;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    loadAllMarkdowns();
    _tabController.addListener(() {
      if (_tabController.indexIsChanging) {
        setState(() {
          _selectedTabIndex = _tabController.index;
        });
      }
    });
  }

  Future<void> loadAllMarkdowns() async {
    for (int i = 0; i < _markdownPaths.length; i++) {
      _markdownContents[i] = await rootBundle.loadString(_markdownPaths[i]);
    }
    setState(() {
      _loading = false;
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return ConstrainedBox(
      constraints: const BoxConstraints(
        maxWidth: 600,
        maxHeight: 550,
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
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.benekBlack.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: TabBar(
                      controller: _tabController,
                      labelColor: Colors.white,
                      unselectedLabelColor: Colors.grey,
                      indicatorColor: Colors.white,
                      tabs: _tabs.map((tab) => Tab(text: tab)).toList(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Expanded(
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
                            data: _markdownContents[_selectedTabIndex] ?? "",
                            selectable: true,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
