class WYRQuestion {
  final String optionA;
  final int votesA;
  final String optionB;
  final int votesB;
  double? userPercentage;

  WYRQuestion({
    required this.optionA,
    required this.votesA,
    required this.optionB,
    required this.votesB,
    this.userPercentage,
  });
  static List<WYRQuestion> getQuestions() {
    List<WYRQuestion> questions = [];

    questions.add(WYRQuestion(
      optionA: 'Be painted by Van Gogh',
      votesA: 462554,
      optionB: 'Be painted by Da Vinci',
      votesB: 1121946,
    ));

    questions.add(WYRQuestion(
      optionA: 'Run 26 miles',
      votesA: 915383,
      optionB: 'Swim 5 miles',
      votesB: 901412,
    ));

    questions.add(WYRQuestion(
      optionA:
          'Speak every language except the language of the country you\'re currently in',
      votesA: 597685,
      optionB:
          'Speak only the language of the country you\'re in, but know the meaning of every single word in that language',
      votesB: 1084849,
    ));

    return questions;
  }
}
