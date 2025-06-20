import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';
import '../../../common/constants/app_colors.dart';
import '../../../data/models/user_profile_models/auth_role_model.dart';

class AuthRoleHelper {
  // String Values
  static String regularUser = BenekStringHelpers.locale('regularUser');
  static String superAdmin = BenekStringHelpers.locale('superAdmin');
  static String developer = BenekStringHelpers.locale('developer');
  static String moderator = BenekStringHelpers.locale('moderator');
  static String accountant = BenekStringHelpers.locale('accountant');
  static String unauthorizedUser = BenekStringHelpers.locale('unauthorizedUser');

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

  static int getAuthRoleIdFromRoleName(String authRoleText) {
    switch (authRoleText) {
      case 'regularUser':
        return 0;
      case 'superAdmin':
        return 1;
      case 'developer':
        return 2;
      case 'moderator':
        return 3;
      case 'accountant':
        return 4;
      default:
        return -1;
    }
  }

  static bool checkIfRequiredRole(int authRole, List<int> requiredRoles) {
    return requiredRoles.contains(authRole);
  }
}