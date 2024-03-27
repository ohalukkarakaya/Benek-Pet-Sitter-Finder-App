import 'package:flutter/material.dart';
import '../../../common/constants/app_colors.dart';
import '../../../data/models/user_profile_models/auth_role_model.dart';

class AuthRoleHelper {
  // String Values
  static const String regularUser = 'Yetkisiz Kullanıcı';
  static const String superAdmin = 'Super Admin';
  static const String developer = 'Geliştirici';
  static const String moderator = 'Modaratör';
  static const String accountant = 'Muhasebe';
  static const String unauthorizedUser = 'Kayıt Bulunamadı';

  // Text Color Values
  static const Color regularUserColor = AppColors.benekRed;
  static const Color superAdminColor = AppColors.benekSuccessGreen;
  static const Color developerColor = AppColors.benekBlue;
  static const Color moderatorColor = AppColors.benekWarningOrange;
  static const Color accountantColor = AppColors.benekPurple;
  static const Color unauthorizedUserColor = AppColors.benekRed;

  static AuthRoleData getAuthRoleDataFromId(int authRole) {
    switch (authRole) {
      case 0:
        return AuthRoleData( authRole: 0, authRoleColor: regularUserColor, authRoleText: regularUser );
      case 1:
        return AuthRoleData( authRole: 1, authRoleColor: superAdminColor, authRoleText: superAdmin );
      case 2:
        return AuthRoleData( authRole: 2, authRoleColor: developerColor, authRoleText: developer );
      case 3:
        return AuthRoleData( authRole: 3, authRoleColor: moderatorColor, authRoleText: moderator );
      case 4:
        return AuthRoleData( authRole: 4, authRoleColor: accountantColor, authRoleText: accountant );
      default:
        return AuthRoleData( authRole: -1, authRoleColor: unauthorizedUserColor, authRoleText: unauthorizedUser );
    }
  }
}