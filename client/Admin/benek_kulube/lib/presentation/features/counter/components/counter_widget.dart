import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import '../../../../store/app_state.dart';
import '../redux/counter_actions.dart';

class CounterWidget extends StatelessWidget {
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
              style: TextStyle(fontSize: 18),
            ),
            SizedBox(height: 16),
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