import 'package:devtodollars/services/questions_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class WYROnlineScreen extends ConsumerStatefulWidget {
  const WYROnlineScreen({super.key});

  @override
  ConsumerState<WYROnlineScreen> createState() => _WYROnlineScreenState();
}

class _WYROnlineScreenState extends ConsumerState<WYROnlineScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(userChoicesProvider.notifier).state = [];
    });
  }

  void _quitGame() {
    context.replaceNamed('gameover');
  }

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Would You Rather'),
        actions: [
          IconButton(
            icon: const Icon(Icons.exit_to_app),
            onPressed: _quitGame,
          ),
        ],
      ),
      body: const Center(
        child: Text('WYROnlineScreen'),
      ),
    );
  }
}
