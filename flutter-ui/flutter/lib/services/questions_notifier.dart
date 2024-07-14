import 'package:devtodollars/models/wyr_questions_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final questionsProvider =
    StateNotifierProvider<QuestionsNotifier, List<WYRQuestion>>((ref) {
  return QuestionsNotifier();
});

final userChoicesProvider = StateProvider<List<double>>((ref) {
  return [];
});

class QuestionsNotifier extends StateNotifier<List<WYRQuestion>> {
  QuestionsNotifier() : super(WYRQuestion.getQuestions());

  void answerQuestion(int index, double percentage) {
    state = [
      for (int i = 0; i < state.length; i++)
        if (i == index)
          WYRQuestion(
            optionA: state[i].optionA,
            votesA: state[i].votesA,
            optionB: state[i].optionB,
            votesB: state[i].votesB,
            userPercentage: percentage,
          )
        else
          state[i],
    ];
  }
}
