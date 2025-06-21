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
      mainAxisAlignment: MainAxisAlignment.start, // 👈 Ortadan sola alındı
      children: Gender.values.map((gender) {
        final isSelected = gender == selectedGender;

        return GestureDetector(
          onTap: () => onChanged(gender),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            margin: const EdgeInsets.symmetric(horizontal: 10),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isSelected
                  ? AppColors.benekLightBlue.withOpacity(0.7)
                  : AppColors.benekWhite.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected ? AppColors.benekBlack : AppColors.benekGrey,
                width: isSelected ? 2 : 1,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: Colors.blueAccent.withOpacity(0.3),
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