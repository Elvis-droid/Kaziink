import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { Field, Btn, Banner } from '../components';
import { C } from '../theme';

export default function AuthScreen({ go, uType, setUser, workers, setWorkers, employers, setEmployers }) {
  const [mode, setMode] = useState('signup');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [conf, setConf] = useState('');
  const [err, setErr] = useState('');
  const isW = uType === 'worker';
  const accent = isW ? C.primary : C.accentMid;

  const doSignup = () => {
    setErr('');
    if (!phone || !pass) return setErr('Please enter your phone number and password.');
    if (pass !== conf) return setErr('Passwords do not match. Please try again.');
    const list = isW ? workers : employers;
    if (list.find(u => u.phone === phone)) return setErr('Account already exists. Please sign in.');
    const u = { id: `${uType}-${Date.now()}`, phone, pass, type: uType, profileDone: false };
    if (isW) setWorkers(p => [...p, u]); else setEmployers(p => [...p, u]);
    setUser(u);
    go(isW ? 'worker-profile' : 'emp-profile');
  };

  const doSignin = () => {
    setErr('');
    const list = isW ? workers : employers;
    const u = list.find(x => x.phone === phone && x.pass === pass);
    if (!u) return setErr('Phone number or password is incorrect.');
    setUser(u);
    go(isW ? (u.profileDone ? 'worker-feed' : 'worker-profile') : (u.profileDone ? 'emp-dash' : 'emp-profile'));
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={accent} />

      {/* Header */}
      <View style={[s.header, { backgroundColor: accent }]}>
        <TouchableOpacity onPress={() => go('landing')} style={s.backBtn} activeOpacity={0.8}>
          <Text style={s.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerIcon}>{isW ? '👷' : '🏢'}</Text>
        <Text style={s.headerTitle}>{isW ? 'Worker Account' : 'Employer Account'}</Text>
        <Text style={s.headerSub}>{mode === 'signup' ? 'Create your free account' : 'Welcome back to KaziLink'}</Text>
      </View>

      {/* Form Card */}
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Tab Toggle */}
        <View style={s.tabRow}>
          {['signup', 'signin'].map(m => (
            <TouchableOpacity key={m} onPress={() => setMode(m)} style={[s.tab, mode === m && s.tabActive]} activeOpacity={0.8}>
              <Text style={[s.tabTxt, mode === m && { color: C.text }]}>{m === 'signup' ? 'Sign Up' : 'Sign In'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {err !== '' && <Banner text={'⚠️  ' + err} color="red" />}

        <Field label="Phone Number" value={phone} onChangeText={setPhone} type="tel" placeholder="e.g. 0712 345 678" required />
        <Field label="Password" value={pass} onChangeText={setPass} type="password" required />
        {mode === 'signup' && <Field label="Confirm Password" value={conf} onChangeText={setConf} type="password" required />}

        <Btn
          onPress={mode === 'signup' ? doSignup : doSignin}
          variant={isW ? 'primary' : 'secondary'}
          style={s.submitBtn}>
          {mode === 'signup' ? 'Create Account  →' : 'Sign In  →'}
        </Btn>

        <Text style={s.terms}>
          By continuing you agree to KaziLink's Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { paddingTop: 54, paddingBottom: 32, paddingHorizontal: 24 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
  backTxt: { color: C.white, fontSize: 18, fontWeight: '700' },
  headerIcon: { fontSize: 44, marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: C.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  scroll: { flex: 1, marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: C.white },
  scrollContent: { padding: 24, paddingBottom: 48 },
  tabRow: { flexDirection: 'row', backgroundColor: C.background, borderRadius: 16, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: C.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabTxt: { fontWeight: '700', fontSize: 14, color: C.textLight },
  submitBtn: { marginTop: 8 },
  terms: { fontSize: 11, color: C.textLight, textAlign: 'center', marginTop: 16, lineHeight: 16 },
});
