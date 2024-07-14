import 'package:devtodollars/services/auth_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class WYRSoloScreen extends ConsumerStatefulWidget {
  const WYRSoloScreen({super.key, required this.title});

  final String title;

  @override
  ConsumerState<WYRSoloScreen> createState() => _WYRSoloScreenState();
}

class _WYRSoloScreenState extends ConsumerState<WYRSoloScreen> {
  @override
  Widget build(BuildContext context) {
    final authNotif = ref.watch(authProvider.notifier);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [
          TextButton(onPressed: authNotif.signOut, child: const Text("Logout")),
        ],
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[Text('Put stuff here')],
        ),
      ),
    );
  }
}
