import 'package:flutter/material.dart';

import '../constants/app_colors.dart';

const double defaultFontSize = 12.0;

String benekFontFamily = 'Qanelas';

const FontWeight ultraLightFontWeight = FontWeight.w100;
const FontWeight thinFontWeight = FontWeight.w200;
const FontWeight lightFontWeight = FontWeight.w300;
const FontWeight regularFontWeight = FontWeight.w400;
const FontWeight mediumFontWeight = FontWeight.w500   ;
const FontWeight semiBoldFontWeight = FontWeight.w600;
const FontWeight boldFontWeight = FontWeight.w700;
const FontWeight blackFontWeight = FontWeight.w900;

FontWeight getFontWeight(String name){
  switch(name){
    case 'ultraLight':
      return ultraLightFontWeight;
    case 'thin':
      return thinFontWeight;
    case 'light':
      return lightFontWeight;
    case 'regular':
      return regularFontWeight;
    case 'medium':
      return mediumFontWeight;
    case 'semiBold':
      return semiBoldFontWeight;
    case 'bold':
      return boldFontWeight;
    case 'black':
      return blackFontWeight;
    default:
      return regularFontWeight;
  }
}

String defaultFontFamily(){
  return benekFontFamily;
}

TextStyle planeTextStyle(){
  return TextStyle(
    fontFamily: benekFontFamily,
  );
}

planeTextWithoutWeightStyle(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
    }
){
  return TextStyle(
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      color: textColor
  );
}

TextStyle regularTextStyle(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = regularFontWeight
    }
){
  return TextStyle(
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      color: textColor
  );
}

TextStyle regularTextStyleUnderLine(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = regularFontWeight
    }
){
  return TextStyle(
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      color: textColor,
      decoration: TextDecoration.underline,
  );
}

TextStyle regularTextWithoutColorStyle(
    {
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = regularFontWeight,
      Color textColor = AppColors.benekWhite,
    }
){
  return TextStyle(
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      color: textColor
  );
}

TextStyle thinTextStyle(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = thinFontWeight
    }
){
  return TextStyle(
      color: textColor,
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight
  );
}

TextStyle thinTextWithoutColorStyle(
    {
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = thinFontWeight
    }
){
  return TextStyle(
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight
  );
}

TextStyle lightTextStyle(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = lightFontWeight
    }
){
  return TextStyle(
      color: textColor,
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight
  );
}

TextStyle lightTextWithoutColorStyle(
    {
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = lightFontWeight
    }
){
  return TextStyle(
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight
  );
}

TextStyle ultraLightTextStyle(
  {
    Color textColor = AppColors.benekBlack,
    double textFontSize = defaultFontSize,
    FontWeight textFontWeight = ultraLightFontWeight
  }
){
  return TextStyle(
      color: textColor,
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight
  );
}

TextStyle ultraLightTextWithoutColorStyle(
    {
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = ultraLightFontWeight
    }
    ){
  return TextStyle(
      fontFamily: benekFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight
  );
}

TextStyle mediumTextStyle(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = mediumFontWeight
    }
){
  return TextStyle(
      color: textColor,
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      fontFamily: benekFontFamily
  );
}

TextStyle mediumTextWithoutColorStyle(
    {
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = mediumFontWeight,
      Color? textColor = AppColors.benekWhite
    }
){
  return TextStyle(
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      fontFamily: benekFontFamily,
      color: textColor
  );
}

TextStyle semiBoldTextStyle(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = semiBoldFontWeight
    }
){
  return TextStyle(
      color: textColor,
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      fontFamily: benekFontFamily
  );
}

TextStyle semiBoldTextWithoutColorStyle(
    {
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = semiBoldFontWeight
    }
){
  return TextStyle(
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      fontFamily: benekFontFamily
  );
}

TextStyle boldTextStyle(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = boldFontWeight
    }
){
  return TextStyle(
      color: textColor,
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      fontFamily: benekFontFamily
  );
}

TextStyle boldTextWithoutColorStyle(
    {
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = boldFontWeight
    }
){
  return TextStyle(
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      fontFamily: benekFontFamily
  );
}

TextStyle blackTextStyle(
    {
      Color textColor = AppColors.benekBlack,
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = blackFontWeight
    }
){
  return TextStyle(
      color: textColor,
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      fontFamily: benekFontFamily
  );
}

TextStyle blackTextWithoutColorStyle(
    {
      double textFontSize = defaultFontSize,
      FontWeight textFontWeight = blackFontWeight
    }
){
  return TextStyle(
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      fontFamily: benekFontFamily
  );
}