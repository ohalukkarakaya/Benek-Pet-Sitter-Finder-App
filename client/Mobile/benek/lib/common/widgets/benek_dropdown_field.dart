import 'package:flutter/material.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/styles.text.dart';

class BenekModalPickerField<T> extends StatelessWidget {
  final String hintText;
  final T? value;
  final List<T> options;
  final Widget Function(T) display;
  final ValueChanged<T?>? onChanged;

  const BenekModalPickerField({
    super.key,
    required this.hintText,
    required this.options,
    required this.display,
    this.value,
    this.onChanged,
  });

  void _showPicker(BuildContext context) {
    showModalBottomSheet(
      backgroundColor: AppColors.benekBlack,
      context: context,
      builder: (context) {
        return ListView.builder(
          physics: const BouncingScrollPhysics(),
          itemCount: options.length,
          itemBuilder: (context, index) {
            final item = options[index];
            return ListTile(
              title: display(item),
              onTap: () {
                Navigator.pop(context);
                if (onChanged != null) onChanged!(item);
              },
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _showPicker(context),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.benekWhite.withAlpha(26),
          borderRadius: BorderRadius.circular(6),
        ),
        child: value != null ? display(value!) 
                : Text(
                  hintText,
                  style: TextStyle(
                    fontFamily: defaultFontFamily(),
                    fontSize: 14,
                    color: value != null
                        ? AppColors.benekWhite
                        : AppColors.benekWhite.withAlpha(102),
                    fontWeight: getFontWeight('regular'),
                  ),
                ),
      ),
    );
  }
}