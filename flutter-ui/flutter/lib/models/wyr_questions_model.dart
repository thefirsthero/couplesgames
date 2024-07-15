class WYRQuestion {
  final int id;
  final String optionA;
  final int votesA;
  final String optionB;
  final int votesB;
  double? userPercentage;

  WYRQuestion({
    required this.id,
    required this.optionA,
    required this.votesA,
    required this.optionB,
    required this.votesB,
    this.userPercentage,
  });

  factory WYRQuestion.fromJson(Map<String, dynamic> json) {
    return WYRQuestion(
      id: json['id'],
      optionA: json['option_a'],
      votesA: json['votes_a'],
      optionB: json['option_b'],
      votesB: json['votes_b'],
      userPercentage: json['userPercentage']?.toDouble(),
    );
  }

  static List<WYRQuestion> getQuestions() {
    return [];
  }
}
