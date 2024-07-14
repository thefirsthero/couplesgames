import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:devtodollars/services/questions_notifier.dart';

class GameOverScreen extends ConsumerWidget {
  const GameOverScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userChoices = ref.watch(userChoicesProvider);
    double average = userChoices.reduce((a, b) => a + b) / userChoices.length;

    // Determine the color based on the average percentage
    Color backgroundColor;
    if (average < 25) {
      backgroundColor = Colors.green;
    } else if (average < 50) {
      backgroundColor = Colors.blue;
    } else if (average < 75) {
      backgroundColor = Colors.orange;
    } else {
      backgroundColor = Colors.red;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Game Over'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'How common are you?',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 16),
            _buildPercentageIndicator(average, backgroundColor),
          ],
        ),
      ),
    );
  }

  Widget _buildPercentageIndicator(double percentage, Color color) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              height: 200,
              width: 200,
              child: CircularProgressIndicator(
                value: percentage / 100,
                strokeWidth: 20,
                valueColor: AlwaysStoppedAnimation<Color>(color),
              ),
            ),
            Text(
              '${percentage.toStringAsFixed(2)}%',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Text(
          _getPercentageDescription(percentage),
          style: const TextStyle(fontSize: 18),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  String _getPercentageDescription(double percentage) {
    if (percentage < 25) {
      return 'You are less common';
    } else if (percentage < 50) {
      return 'You are somewhat common';
    } else if (percentage < 75) {
      return 'You are quite common';
    } else {
      return 'You are very common';
    }
  }
}
