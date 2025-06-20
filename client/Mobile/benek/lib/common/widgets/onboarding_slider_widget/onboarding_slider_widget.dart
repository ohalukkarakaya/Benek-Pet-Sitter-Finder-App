import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/widgets/benek_horizontal_button.dart';
import 'package:benek/common/widgets/onboarding_slider_widget/onboarding_cards_widget.dart';
import 'package:benek/common/widgets/onboarding_slider_widget/onboarding_dots_widget.dart';
import 'package:benek/common/widgets/onboarding_slider_widget/onbording_slider_image_widget.dart';
import 'package:flutter/material.dart';

class OnBoardingSliderWidget extends StatefulWidget {
  final double height;
  final dynamic Function()? loginOnTap;
  final dynamic Function()? signupOnTap;

  const OnBoardingSliderWidget({
    super.key, 
    this.height = 300,
    this.loginOnTap,
    this.signupOnTap,
  });

  @override
  State<OnBoardingSliderWidget> createState() => _OnBoardingSliderWidgetState();
}

class _OnBoardingSliderWidgetState extends State<OnBoardingSliderWidget> {
  final PageController _imageController = PageController();
  final PageController _cardController = PageController();
  int _currentIndex = 0;

  final List<Map<String, String>> _sliderTexts = [
    {
      'title': 'Biryere mi gideceksin?',
      'subtitle': 'Evcil hayvanın için en güvenilir bakıcıları bul, gözün arkada kalmasın :)'
    },
    {
      'title': 'Hayvanları sever misin?',
      'subtitle': "Benek'li bakıcı olarak hayvan segini ek gelire çevirebilirsin ya da gönüllü olarak hayvan bakarak Dünya'yı daha güzel bir yer yapabilirsin!"
    },
  ];

  @override
  void dispose() {
    _imageController.dispose();
    _cardController.dispose();
    super.dispose();
  }

  void _onCardPageChanged(int index) {
    setState(() => _currentIndex = index);

    Future.delayed(const Duration(milliseconds: 500), () {
      _imageController.animateToPage(
        index,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    });
  }

  @override
Widget build(BuildContext context) {
  final mediaQuery = MediaQuery.of(context);
  final screenWidth = mediaQuery.size.width;
  final screenHeight = mediaQuery.size.height;

  // Responsive ölçüler
  final topPadding = mediaQuery.padding.top;
  final cardHeight = screenHeight * 0.19;
  final verticalSpacing = screenHeight * 0.03;
  final horizontalPadding = screenWidth * 0.05;
  final dividerPadding = screenWidth * 0.08;

  return Column(
    children: [
      SizedBox(height: topPadding),

      /// 🖼 Görsel (sabit kalabilir istersen)
      OnBoardingSliderImageWidget(
        height: screenHeight * 0.43,
        controller: _imageController,
        onPageChanged: (_) {},
      ),

      /// Siyah Kart Alanı
      Expanded(
        child: Container(
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.85),
          ),
          child: Column(
            children: [
              /// 🗂 Kart (yazılar)
              SizedBox(
                height: cardHeight,
                child: PageView.builder(
                  controller: _cardController,
                  itemCount: _sliderTexts.length,
                  onPageChanged: _onCardPageChanged,
                  itemBuilder: (context, index) {
                    return OnBoardingCardWidget(
                      title: _sliderTexts[index]['title']!,
                      subtitle: _sliderTexts[index]['subtitle']!,
                    );
                  },
                ),
              ),

              /// Noktalar
              OnBoardingDotsIndicator(
                itemCount: _sliderTexts.length,
                currentIndex: _currentIndex,
              ),

              SizedBox(height: verticalSpacing),

              /// Divider
              Padding(
                padding: EdgeInsets.symmetric(horizontal: dividerPadding),
                child: Divider(
                  color: AppColors.benekDarkGrey,
                ),
              ),

              SizedBox(height: verticalSpacing * 0.8),

              /// "Üye Ol" Butonu
              Padding(
                padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
                child: BenekHorizontalButton(
                  text: "Üye Ol",
                  isLight: true,
                  width: double.infinity,
                  onTap: widget.signupOnTap
                ),
              ),

              SizedBox(height: verticalSpacing),

              /// "Giriş Yap" Butonu
              Padding(
                padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
                child: BenekHorizontalButton(
                  text: "Giriş Yap",
                  hasOutline: true,
                  width: double.infinity,
                  onTap: widget.loginOnTap
                ),
              ),
            ],
          ),
        ),
      ),
    ],
  );
}

}
