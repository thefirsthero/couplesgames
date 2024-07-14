import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class BottomTabs extends ConsumerStatefulWidget {
  const BottomTabs({super.key});

  @override
  ConsumerState<BottomTabs> createState() => _BottomTabsState();
}

class _BottomTabsState extends ConsumerState<BottomTabs> {
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      if (index == 0) {
        context.replaceNamed('home');
        return;
      }

      context.replaceNamed('settings');
    });
  }

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      selectedItemColor: Theme.of(context).colorScheme.primary,
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          tooltip: 'Choose your game here',
          icon: Icon(Icons.gamepad_outlined),
          label: 'Games',
        ),
        BottomNavigationBarItem(
          tooltip: 'App settings found here',
          icon: Icon(Icons.settings),
          label: 'Settings',
        ),
      ],
      currentIndex: _selectedIndex,
      onTap: _onItemTapped,
    );
  }
}
