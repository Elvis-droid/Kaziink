import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { C } from '../theme';

export default function LandingScreen({ go, setUType }) {
  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primaryDark} />

      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.logo}>🤝</Text>
        <Text style={s.appName}>KaziLink</Text>
        <Text style={s.tagline}>Tanzania's trusted worker–employer platform</Text>
        <View style={s.pill}>
          <View style={s.dot} />
          <Text style={s.pillTxt}>Dar es Salaam  •  Trusted Middleman Service</Text>
        </View>
      </View>

      {/* Cards */}
      <View style={s.cards}>

        {/* Worker Card */}
        <TouchableOpacity
          onPress={() => { setUType('worker'); go('auth'); }}
          style={[s.card, s.cardWhite]}
          activeOpacity={0.88}>
          <Text style={s.cardIcon}>👷</Text>
          <Text style={s.cardTitle}>I'm Looking for Work</Text>
          <Text style={s.cardSub}>Browse jobs posted by employers near you</Text>
          <View style={s.cardBtn}>
            <Text style={s.cardBtnTxt}>Sign In as Worker →</Text>
          </View>
        </TouchableOpacity>

        {/* Employer Card */}
        <TouchableOpacity
          onPress={() => { setUType('employer'); go('auth'); }}
          style={[s.card, s.cardAmber]}
          activeOpacity={0.88}>
          <Text style={s.cardIcon}>🏢</Text>
          <Text style={[s.cardTitle, { color: C.accentDark }]}>I'm Hiring Workers</Text>
          <Text style={[s.cardSub, { color: '#92400e' }]}>Post jobs and find reliable workers quickly</Text>
          <View style={[s.cardBtn, { backgroundColor: C.accentMid }]}>
            <Text style={s.cardBtnTxt}>Sign In as Employer →</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={s.footer}>Questions? Call: +255 700 000 000</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.primaryDark },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 20 },
  logo: { fontSize: 64, marginBottom: 12 },
  appName: { fontSize: 40, fontWeight: '900', color: C.white, letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#99f6e4', marginTop: 6, textAlign: 'center', paddingHorizontal: 30 },
  pill: { flexDirection: 'row', alignItems: 'center', marginTop: 14, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.accent, marginRight: 7 },
  pillTxt: { color: '#99f6e4', fontSize: 11, fontWeight: '600' },
  cards: { paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  card: { borderRadius: 24, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  cardWhite: { backgroundColor: C.white },
  cardAmber: { backgroundColor: C.accent },
  cardIcon: { fontSize: 40, marginBottom: 10 },
  cardTitle: { fontSize: 20, fontWeight: '900', color: C.primaryDark },
  cardSub: { fontSize: 13, color: C.textSub, marginTop: 4, lineHeight: 18 },
  cardBtn: { marginTop: 16, backgroundColor: C.primary, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 16, alignSelf: 'flex-start' },
  cardBtnTxt: { color: C.white, fontWeight: '700', fontSize: 13 },
  footer: { color: '#5eead4', fontSize: 12, textAlign: 'center', paddingBottom: 30 },
});
