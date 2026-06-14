import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  ScrollView, Modal, FlatList, Platform,
} from 'react-native';
import { C, SHADOW } from '../theme';

// ─── Button ───────────────────────────────────────────────────────────────────
export const Btn = ({ onPress, children, variant = 'primary', style, disabled }) => {
  const V = {
    primary:   { bg: C.primary,   text: C.white,      border: 'transparent' },
    secondary: { bg: C.accent,    text: C.accentDark,  border: 'transparent' },
    outline:   { bg: 'transparent', text: C.primary,  border: C.primary },
    ghost:     { bg: 'transparent', text: C.primary,  border: 'transparent' },
    red:       { bg: C.error,     text: C.white,      border: 'transparent' },
    amber:     { bg: C.accent,    text: C.accentDark,  border: 'transparent' },
  };
  const v = V[variant] || V.primary;
  return (
    <TouchableOpacity
      onPress={onPress} disabled={disabled} activeOpacity={0.82}
      style={[s.btn, { backgroundColor: v.bg, borderColor: v.border, borderWidth: v.border === 'transparent' ? 0 : 2 }, style, disabled && s.disabled]}>
      <Text style={[s.btnTxt, { color: v.text }]}>{children}</Text>
    </TouchableOpacity>
  );
};

// ─── Text Input Field ──────────────────────────────────────────────────────────
export const Field = ({ label, value, onChangeText, type, placeholder, required, multiline, numberOfLines = 4 }) => (
  <View style={s.fieldWrap}>
    <Text style={s.fieldLabel}>{label}{required && <Text style={{ color: C.error }}> *</Text>}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || ''}
      placeholderTextColor={C.textLight}
      secureTextEntry={type === 'password'}
      keyboardType={type === 'number' ? 'number-pad' : type === 'tel' ? 'phone-pad' : 'default'}
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines : 1}
      style={[s.input, multiline && { height: numberOfLines * 24 + 24, textAlignVertical: 'top' }]}
    />
  </View>
);

// ─── Select / Picker ──────────────────────────────────────────────────────────
export const Picker = ({ label, value, onSelect, options, required }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}{required && <Text style={{ color: C.error }}> *</Text>}</Text>
      <TouchableOpacity onPress={() => setOpen(true)} style={s.pickerBtn} activeOpacity={0.8}>
        <Text style={{ color: value ? C.text : C.textLight, fontSize: 14, flex: 1 }}>{value || '— Select —'}</Text>
        <Text style={{ color: C.textSub, fontSize: 12 }}>▼</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={s.modalBox}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{label}</Text>
            <ScrollView>
              {options.map(opt => (
                <TouchableOpacity key={opt} onPress={() => { onSelect(opt); setOpen(false); }}
                  style={[s.modalItem, value === opt && s.modalItemActive]}>
                  <Text style={[s.modalItemTxt, value === opt && { color: C.primary, fontWeight: '700' }]}>{opt}</Text>
                  {value === opt && <Text style={{ color: C.primary }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ─── Badge / Chip ─────────────────────────────────────────────────────────────
export const Chip = ({ text, color = 'teal' }) => {
  const chips = {
    teal:  { bg: C.primaryLight, text: C.primaryDark },
    amber: { bg: C.accentLight,  text: C.accentDark  },
    green: { bg: C.successBg,    text: C.successText  },
    red:   { bg: C.errorBg,      text: C.errorText    },
    gray:  { bg: C.borderLight,  text: C.textMid      },
  };
  const c = chips[color] || chips.teal;
  return (
    <View style={[s.chip, { backgroundColor: c.bg }]}>
      <Text style={[s.chipTxt, { color: c.text }]}>{text}</Text>
    </View>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style }) => (
  <View style={[s.card, style]}>{children}</View>
);

// ─── Top Bar ──────────────────────────────────────────────────────────────────
export const TopBar = ({ title, onBack, bgColor, right }) => (
  <View style={[s.topBar, { backgroundColor: bgColor || C.primary }]}>
    {onBack
      ? <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
      : <View style={{ width: 36 }} />
    }
    <Text style={s.topBarTitle} numberOfLines={1}>{title}</Text>
    <View style={{ width: 36 }}>{right}</View>
  </View>
);

// ─── Progress Tracker ─────────────────────────────────────────────────────────
export const ProgressTrack = ({ step, steps }) => {
  const STEPS = steps || ['Confirmed', 'Arrived', 'Inspection', 'Completed'];
  const idx = STEPS.indexOf(step);
  return (
    <View style={s.progressRow}>
      {STEPS.map((st, i) => (
        <View key={st} style={s.progressItem}>
          {i < STEPS.length - 1 && (
            <View style={[s.progressLine, i < idx && { backgroundColor: C.primary }]} />
          )}
          <View style={[s.progressDot, i <= idx ? { backgroundColor: C.primary } : { backgroundColor: C.border }]}>
            <Text style={{ color: i <= idx ? C.white : C.textLight, fontSize: 10, fontWeight: '700' }}>
              {i < idx ? '✓' : i + 1}
            </Text>
          </View>
          <Text style={[s.progressLabel, i <= idx ? { color: C.primary } : { color: C.textLight }]} numberOfLines={1}>{st}</Text>
        </View>
      ))}
    </View>
  );
};

// ─── Info Banner ──────────────────────────────────────────────────────────────
export const Banner = ({ text, color = 'teal' }) => {
  const colors = {
    teal:  { bg: C.primaryBg,  border: C.primaryLight, text: C.primaryDark },
    amber: { bg: C.accentBg,   border: C.accentLight,  text: C.accentDark  },
    green: { bg: C.successBg,  border: '#86efac',      text: C.successText },
    red:   { bg: C.errorBg,    border: '#fca5a5',      text: C.errorText   },
  };
  const c = colors[color] || colors.teal;
  return (
    <View style={[s.banner, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[s.bannerTxt, { color: c.text }]}>{text}</Text>
    </View>
  );
};

// ─── Nav Item ─────────────────────────────────────────────────────────────────
export const NavItem = ({ icon, label, active, onPress, activeColor }) => (
  <TouchableOpacity onPress={onPress} style={s.navItem} activeOpacity={0.7}>
    <Text style={s.navIcon}>{icon}</Text>
    <Text style={[s.navLabel, { color: active ? (activeColor || C.primary) : C.textLight }]}>{label}</Text>
    {active && <View style={[s.navDot, { backgroundColor: activeColor || C.primary }]} />}
  </TouchableOpacity>
);

// ─── Bottom Nav Bar ───────────────────────────────────────────────────────────
export const NavBar = ({ items, activeColor }) => (
  <View style={s.navBar}>
    {items.map(item => (
      <NavItem key={item.label} {...item} activeColor={activeColor} />
    ))}
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Button
  btn: { paddingVertical: 15, paddingHorizontal: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnTxt: { fontWeight: '800', fontSize: 15, letterSpacing: 0.2 },
  disabled: { opacity: 0.5 },

  // Field
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: C.textSub, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  input: { borderWidth: 2, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 10, fontSize: 14, color: C.text, backgroundColor: C.white },

  // Picker
  pickerBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, backgroundColor: C.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: C.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 32, maxHeight: '70%' },
  modalHandle: { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalTitle: { fontSize: 15, fontWeight: '800', color: C.text, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.borderLight },
  modalItemActive: { backgroundColor: C.primaryBg },
  modalItemTxt: { fontSize: 14, color: C.text, flex: 1 },

  // Chip
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  chipTxt: { fontSize: 11, fontWeight: '700' },

  // Card
  card: { backgroundColor: C.white, borderRadius: 20, padding: 16, marginBottom: 14, ...SHADOW.sm },

  // TopBar
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 14, paddingTop: Platform.OS === 'ios' ? 54 : 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
  backArrow: { color: C.white, fontSize: 18, fontWeight: '700' },
  topBarTitle: { flex: 1, color: C.white, fontWeight: '800', fontSize: 16, textAlign: 'center', marginHorizontal: 4 },

  // Progress
  progressRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 12 },
  progressItem: { flex: 1, alignItems: 'center', position: 'relative' },
  progressLine: { position: 'absolute', top: 14, left: '50%', right: '-50%', height: 2, backgroundColor: C.border, zIndex: 0 },
  progressDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  progressLabel: { fontSize: 10, fontWeight: '600', marginTop: 4, textAlign: 'center' },

  // Banner
  banner: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14 },
  bannerTxt: { fontSize: 13, fontWeight: '500', lineHeight: 20 },

  // Nav
  navBar: { flexDirection: 'row', backgroundColor: C.white, borderTopWidth: 1, borderColor: C.borderLight, paddingBottom: Platform.OS === 'ios' ? 20 : 6, paddingTop: 8, paddingHorizontal: 8, ...SHADOW.sm },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  navDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
});
