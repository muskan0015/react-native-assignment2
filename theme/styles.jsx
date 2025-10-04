import { StyleSheet } from 'react-native';

const primary = '#325cda';
const radius = 12;
const fabGreen = '#19A45C';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  headerWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },

  row: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff' },
  rowReverse: { flexDirection: 'row-reverse', alignItems: 'center', padding: 12, backgroundColor: '#fff' },
  nameWrap: { flex: 1, paddingHorizontal: 12 },
  firstName: { fontSize: 16, fontWeight: '600' },
  lastName: { fontSize: 13, opacity: 0.7 },
  separator: { height: 1, backgroundColor: '#eee', marginLeft: 72 },

  // Swipe-to-delete right actions
  rightActionWrap: { justifyContent: 'center', alignItems: 'center', width: 96, backgroundColor: '#e53935' },
  rightActionText: { color: '#fff', fontWeight: '700' },

  listContent: { paddingBottom: 96 },

  // Avatar (custom)
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#cbd5e1',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarInitial: { fontSize: 22, fontWeight: '700', color: '#334155' },

  // FAB (custom)
  fab: {
    position: 'absolute', right: 16, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: fabGreen,
    alignItems: 'center', justifyContent: 'center',
    // shadow iOS
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    // elevation Android
    elevation: 6,
  },
  fabPlus: { fontSize: 30, color: '#fff', lineHeight: 30, marginTop: -2 },
});

export { styles, primary, radius, fabGreen };
