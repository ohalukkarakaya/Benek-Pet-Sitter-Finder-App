import 'package:benek/common/widgets/login_screen_widgets/login_widget.dart';
import 'package:benek/common/widgets/onboarding_slider_widget/onboarding_slider_widget.dart';
import 'package:flutter/material.dart';

enum LoginAction {
  LOGIN,
  SIGNUP,
  DEFAULT,
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  LoginAction currentAction = LoginAction.DEFAULT;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: currentAction == LoginAction.DEFAULT
          ? OnBoardingSliderWidget(
              loginOnTap: () {
                setState(() {
                  currentAction = LoginAction.LOGIN;
                });
              },
              signupOnTap: () {
                setState(() {
                  currentAction = LoginAction.SIGNUP;
                });
              },
            )
          : currentAction == LoginAction.LOGIN
              ? LoginWidget(
                  defaultOnTap: () {
                    setState(() {
                      currentAction = LoginAction.DEFAULT;
                    });
                  },
                  signupOnTap: () {
                    currentAction = LoginAction.SIGNUP;
                  },
                )
              : currentAction == LoginAction.SIGNUP
                  ? const SizedBox()
                  : OnBoardingSliderWidget(
                      loginOnTap: () {
                        setState(() {
                          currentAction = LoginAction.LOGIN;
                        });
                      },
                      signupOnTap: () {
                        setState(() {
                          currentAction = LoginAction.SIGNUP;
                        });
                      },
                    ),
    );
  }
}
