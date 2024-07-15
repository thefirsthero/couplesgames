import 'dart:math';
import 'package:devtodollars/models/wyr_questions_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

final questionsProvider =
    StateNotifierProvider<QuestionsNotifier, List<WYRQuestion>>((ref) {
  return QuestionsNotifier(ref);
});

final userChoicesProvider = StateProvider<List<double>>((ref) {
  return [];
});

class QuestionsNotifier extends StateNotifier<List<WYRQuestion>> {
  final Ref ref;

  QuestionsNotifier(this.ref) : super([]) {
    fetchQuestions();
  }

  Future<void> fetchQuestions() async {
    try {
      final supabaseClient = Supabase.instance.client;
      final response = await supabaseClient.functions.invoke('get_wyr_solo_questions');

      if (response.data != null) {
        List<dynamic> data = response.data;
        List<WYRQuestion> questions = data.map((json) => WYRQuestion.fromJson(json)).toList();
        questions.shuffle(Random());  // Randomize the list
        state = questions;
      } else {
        debugPrint('Error: Failed to load questions. Response data is null.');
        throw Exception('Failed to load questions. Response data is null.');
      }
    } catch (error) {
      debugPrint('Error fetching questions: $error');
      throw Exception('Failed to load questions. Error: $error');
    }
  }

  void answerQuestion(int index, double percentage) {
    state = [
      for (int i = 0; i < state.length; i++)
        if (i == index)
          WYRQuestion(
            id: state[i].id,
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
