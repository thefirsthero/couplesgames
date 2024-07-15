import 'package:devtodollars/models/wyr_questions_model.dart';
import 'package:devtodollars/services/questions_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class WYRSoloScreen extends ConsumerStatefulWidget {
  const WYRSoloScreen({super.key});

  @override
  ConsumerState<WYRSoloScreen> createState() => _WYRSoloScreenState();
}

class _WYRSoloScreenState extends ConsumerState<WYRSoloScreen> {
  final PageController _pageController = PageController();

  @override
  void initState() {
    super.initState();
    // Reset the user choices state when the screen is opened
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(userChoicesProvider.notifier).state = [];
    });
  }

  void _onOptionSelected(String selectedOption, int index) {
    final questions = ref.read(questionsProvider);
    final userChoices = ref.read(userChoicesProvider);

    double percentage;
    if (selectedOption == 'A') {
      percentage = questions[index].votesA /
          (questions[index].votesA + questions[index].votesB);
    } else {
      percentage = questions[index].votesB /
          (questions[index].votesA + questions[index].votesB);
    }

    percentage *= 100;
    userChoices.add(percentage);

    ref.read(userChoicesProvider.notifier).state = userChoices;

    ShadToaster.of(context).show(
      ShadToast(
        showCloseIconOnlyWhenHovered: false,
        duration: const Duration(seconds: 3),
        title: const Text('Nice! ☺'),
        description: Text(
            '${percentage.toStringAsFixed(2)}% of other people chose the same option'),
      ),
    );

    if (index == questions.length - 1) {
      context.replaceNamed('gameover');
    } else {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeIn,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final questions = ref.watch(questionsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Would You Rather'),
      ),
      body: PageView.builder(
        controller: _pageController,
        itemCount: questions.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: QuestionCard(
              question: questions[index],
              index: index,
              onOptionSelected: (selectedOption) {
                _onOptionSelected(selectedOption, index);
              },
            ),
          );
        },
      ),
    );
  }
}

class QuestionCard extends StatelessWidget {
  final WYRQuestion question;
  final int index;
  final Function(String) onOptionSelected;

  const QuestionCard({
    super.key, 
    required this.question,
    required this.index,
    required this.onOptionSelected,
  });

  @override
  Widget build(BuildContext context) {
    final Color baseColor = Colors.primaries[index % Colors.primaries.length];
    final Color topColor = baseColor.withOpacity(0.8);
    final Color bottomColor = baseColor.withOpacity(0.5);

    return Column(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => onOptionSelected('A'),
            child: Card(
              color: topColor,
              margin: const EdgeInsets.only(bottom: 8),
              child: Center(
                child: Padding(
                  padding:
                      const EdgeInsets.all(16.0),
                  child: Text(
                    question.optionA,
                    style: const TextStyle(fontSize: 24),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
          ),
        ),
        Stack(
          alignment: Alignment.center,
          children: [
            const Divider(
              thickness: 2,
              indent: 20,
              endIndent: 20,
            ),
            Container(
              color: Theme.of(context).colorScheme.surface,
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: const Text(
                'OR',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        Expanded(
          child: GestureDetector(
            onTap: () => onOptionSelected('B'),
            child: Card(
              color: bottomColor,
              margin: const EdgeInsets.only(top: 8),
              child: Center(
                child: Padding(
                  padding:
                      const EdgeInsets.all(16.0),
                  child: Text(
                    question.optionB,
                    style: const TextStyle(fontSize: 24),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
