import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Field, Picker, Btn, Card, Banner } from '../components';
import { C } from '../theme';
import { EDU_OPTS } from '../data';

export default function EmployerProfileScreen({ go, user, setUser, employers, setEmployers }) {
  const [nin,        setNin]        = useState(user?.nin        || '');
  const [company,    setCompany]    = useState(user?.company    || '');
  const [firstName,  setFirstName]  = useState(user?.firstName  || '');
  const [middleName, setMiddleName] = useState(user?.middleName || '');
  const [surname,    setSurname]    = useState(user?.surname    || '');
  const [residence,  setResidence]  = useState(user?.residence  || '');
  const [age,        setAge]        = useState(user?.age        || '');
  const [gender,     setGender]     = useState(user?.gender     || '');
  const [education,  setEducation]  = useState(user?.education  || '');
  const [marital,    setMarital]    = useState(user?.marital    || '');
  const [saving,     setSaving]     = useState(false);

  const save = () => {
    if (!nin || !firstName || !surname)
      return Alert.alert('Required Fields', 'Please fill in NIN, First Name, and Surname.');
    setSaving(true);
    const upd = { ...user, nin, company, firstName, middleName, surname, residence, age, gender, education, marital, profileDone: true };
    setUser(upd);
    setEmployers(p => p.map(e => e.id === user.id ? upd : e));
    setTimeout(() => { setSaving(false); go('emp-dash'); }, 600);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => go('landing')} style={s.backBtn}>
          <Text style={s.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Employer Profile</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Banner text="🏢  Complete your profile so workers can trust your job postings." color="amber" />

        <Card>
          <Text style={s.sLabel}>🪪  Identity</Text>
          <Field label="National Identity Number (NIN)" value={nin} onChangeText={setNin} placeholder="Enter your NIN" required />
          <Field label="Company / Business Name" value={company} onChangeText={setCompany} placeholder="Leave blank if individual employer" />
        </Card>

        <Card>
          <Text style={s.sLabel}>👤  Full Name</Text>
          <Field label="First Name"          value={firstName}  onChangeText={setFirstName}  required />
          <Field label="Middle Name"         value={middleName} onChangeText={setMiddleName} placeholder="Optional" />
          <Field label="Surname / Last Name" value={surname}    onChangeText={setSurname}    required />
        </Card>

        <Card>
          <Text style={s.sLabel}>📍  Personal Details</Text>
          <Field label="Place of Residence"   value={residence}  onChangeText={setResidence}  placeholder="e.g. Oyster Bay, Dar es Salaam" required />
          <Field label="Age"                  value={age}        onChangeText={setAge}         type="number" placeholder="e.g. 45" />
          <Picker label="Gender"              value={gender}     onSelect={setGender}          options={['Male','Female','Prefer not to say']} />
          <Picker label="Highest Education"   value={education}  onSelect={setEducation}       options={EDU_OPTS} />
          <Picker label="Marital Status"      value={marital}    onSelect={setMarital}         options={['Single','Married','Divorced','Widowed']} />
        </Card>

        <TouchableOpacity onPress={save} disabled={saving} activeOpacity={0.82}
          style={[s.saveBtn, saving && { opacity: 0.5 }]}>
          <Text style={s.saveTxt}>{saving ? '✅  Saving...' : 'Save Profile & Post Jobs  →'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: C.background },
  header:     { flexDirection: 'row', alignItems: 'center', backgroundColor: C.accentMid, paddingTop: 54, paddingBottom: 16, paddingHorizontal: 16, gap: 10 },
  backBtn:    { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  backTxt:    { color: C.white, fontSize: 18, fontWeight: '700' },
  headerTitle:{ fontSize: 17, fontWeight: '800', color: C.white, flex: 1 },
  scroll:     { flex: 1 },
  content:    { padding: 16, paddingBottom: 30 },
  sLabel:     { fontSize: 11, fontWeight: '800', color: C.textLight, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 },
  saveBtn:    { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  saveTxt:    { fontSize: 15, fontWeight: '800', color: C.accentDark },
});
