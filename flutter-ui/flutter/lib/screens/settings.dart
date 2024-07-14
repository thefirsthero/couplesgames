import 'package:devtodollars/components/common/bottom_nav_bar.dart';
import 'package:devtodollars/services/auth_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key, required this.title});

  final String title;

  @override
  ConsumerState<SettingsScreen> createState() => SettingsScreenState();
}

class SettingsScreenState extends ConsumerState<SettingsScreen> {
  @override
  Widget build(BuildContext context) {
    final authNotif = ref.watch(authProvider.notifier);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [
          TextButton(
            onPressed: () => context.replaceNamed("payments"),
            child: const Text("Payments"),
          ),
          TextButton(onPressed: authNotif.signOut, child: const Text("Logout")),
        ],
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[Text('Put stuff here')],
        ),
      ),
      bottomNavigationBar: const BottomTabs(),
    );
  }
}
