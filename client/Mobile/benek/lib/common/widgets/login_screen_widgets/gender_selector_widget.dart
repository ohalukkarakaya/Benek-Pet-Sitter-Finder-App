import 'package:benek/common/constants/app_colors.dart';
import 'package:flutter/material.dart';

enum Gender { male, female }

class GenderSelector extends StatelessWidget {
  final Gender selectedGender;
  final ValueChanged<Gender> onChanged;

  const GenderSelector({
    super.key,
    required this.selectedGender,
    required this.onChanged,
  });

  @override
Widget build(BuildContext context) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.start,
    children: Gender.values.asMap().entries.map((entry) {
      final index = entry.key;
      final gender = entry.value;
      final isSelected = gender == selectedGender;

      return GestureDetector(
        onTap: () => onChanged(gender),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: EdgeInsets.only(left: index == 1 ? 10 : 0), // 👈 sadece 2. eleman
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.benekLightBlue.withAlpha(179)
                : AppColors.benekWhite.withAlpha(26),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.benekBlack : AppColors.benekGrey,
              width: 2
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.blueAccent.withAlpha(77),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    )
                  ]
                : [],
          ),
          child: Icon(
            gender == Gender.male ? Icons.male : Icons.female,
            color: isSelected ? AppColors.benekBlack : Colors.grey,
            size: 36,
          ),
        ),
      );
    }).toList(),
  );
}
}