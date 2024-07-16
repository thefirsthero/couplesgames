import 'package:flutter/material.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class ShadTabItem extends ShadTab<String> {
  ShadTabItem({super.key, 
    required super.value,
    required String text,
    required String title,
    required Widget content,
    required VoidCallback super.onPressed,
  }) : super(
          text: Text(text),
          content: ShadCard(
            title: Text(title),
            content: content,
          ),
        );
}
