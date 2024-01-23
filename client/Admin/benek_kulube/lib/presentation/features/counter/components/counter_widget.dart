import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import '../../../../store/app_state.dart';
import '../redux/counter_actions.dart';

class CounterWidget extends StatelessWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, int>(
      converter: (Store<AppState> store) => store.state.counter,
      builder: (BuildContext context, int counter) {
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Counter Value: $counter',
              style: const TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    StoreProvider.of<AppState>(context).dispatch(IncrementCounterAction());
                  },
                  child: const Text('Increment'),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: () {
                    StoreProvider.of<AppState>(context).dispatch(DecrementCounterAction());
                  },
                  child: const Text('Decrement'),
                ),
              ],
            ),
          ],
        );
      },
    );
  }
}