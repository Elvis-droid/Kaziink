import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Field, Picker, Btn, Card, Banner } from '../components';
import { C, SHADOW } from '../theme';
import { EDU_OPTS } from '../data';

export default function WorkerProfileScreen({ go, user, setUser, workers, setWorkers }) {
  const [nin,       setNin]       = useState(user?.nin       || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [middleName,setMiddleName]= useState(user?.middleName|| '');
  const [surname,   setSurname]   = useState(user?.surname   || '');
  const [residence, setResidence] = useState(user?.residence || '');
  const [age,       setAge]       = useState(user?.age       || '');
  const [gender,    setGender]    = useState(user?.gender    || '');
  const [education, setEducation] = useState(user?.education || '');
  const [marital,   setMarital]   = useState(user?.marital   || '');
  const [photos,    setPhotos]    = useState(user?.photos    || [null, null, null]);
  const [saving,    setSaving]    = useState(false);

  const pickPhoto = async (index) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed', 'Please allow photo access in settings.');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const updated = [...photos];
      updated[index] = result.assets[0].uri;
      setPhotos(updated);
    }
  };

  const save = () => {
    if (!nin || !firstName || !surname) {
      return Alert.alert('Required Fields', 'Please fill in NIN, First Name, and Surname.');
    }
    setSaving(true);
    const updated = { ...user, nin, firstName, middleName, surname, residence, age, gender, education, marital, photos, profileDone: true };
    setUser(updated);
    setWorkers(p => p.map(w => w.id === user.id ? updated : w));
    setTimeout(() => { setSaving(false); go('worker-feed'); }, 600);
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => go('landing')} style={s.backBtn}>
          <Text style={s.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Complete Your Profile</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Banner text="📋  Fill all details carefully. Your profile is shown to employers — honesty builds trust." color="teal" />

        {/* Identity */}
        <Card>
          <Text style={s.sLabel}>🪪  Identity</Text>
          <Field label="National Identity Number (NIN)" value={nin} onChangeText={setNin} placeholder="Enter your NIN" required />
        </Card>

        {/* Full Name */}
        <Card>
          <Text style={s.sLabel}>👤  Full Name</Text>
          <Field label="First Name"        value={firstName}  onChangeText={setFirstName}  required />
          <Field label="Middle Name"       value={middleName} onChangeText={setMiddleName} placeholder="Optional" />
          <Field label="Surname / Last Name" value={surname}  onChangeText={setSurname}    required />
        </Card>

        {/* Personal Details */}
        <Card>
          <Text style={s.sLabel}>📍  Personal Details</Text>
          <Field label="Place of Residence" value={residence} onChangeText={setResidence} placeholder="e.g. Kinondoni, Dar es Salaam" required />
          <Field label="Age" value={age} onChangeText={setAge} type="number" placeholder="e.g. 28" required />
          <Picker label="Gender"        value={gender}    onSelect={setGender}    options={['Male','Female','Prefer not to say']} required />
          <Picker label="Highest Education" value={education} onSelect={setEducation} options={EDU_OPTS} required />
          <Picker label="Marital Status" value={marital}  onSelect={setMarital}   options={['Single','Married','Divorced','Widowed']} />
        </Card>

        {/* Photos */}
        <Card>
          <Text style={s.sLabel}>📸  Profile Photos</Text>
          <Text style={s.photoHint}>Upload 3 clear photos. Employers will see these on your profile.</Text>
          <View style={s.photoRow}>
            {[0,1,2].map(i => (
              <TouchableOpacity key={i} onPress={() => pickPhoto(i)} style={s.photoBox} activeOpacity={0.8}>
                {photos[i]
                  ? <Image source={{ uri: photos[i] }} style={s.photoImg} />
                  : <View style={s.photoPlaceholder}>
                      <Text style={s.photoIcon}>📷</Text>
                      <Text style={s.photoNum}>Photo {i+1}</Text>
                    </View>
                }
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Btn onPress={save} disabled={saving} style={s.saveBtn}>
          {saving ? '✅  Saving...' : 'Save Profile & Browse Jobs  →'}
        </Btn>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, paddingTop: 54, paddingBottom: 16, paddingHorizontal: 16, gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  backTxt: { color: C.white, fontSize: 18, fontWeight: '700' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: C.white, flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },
  sLabel: { fontSize: 11, fontWeight: '800', color: C.textLight, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 },
  photoHint: { fontSize: 12, color: C.textSub, marginBottom: 12, lineHeight: 18 },
  photoRow: { flexDirection: 'row', gap: 10 },
  photoBox: { flex: 1, aspectRatio: 1, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: C.border, borderStyle: 'dashed' },
  photoImg: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' },
  photoIcon: { fontSize: 26 },
  photoNum: { fontSize: 10, color: C.textLight, marginTop: 4, fontWeight: '600' },
  saveBtn: { marginTop: 4 },
});
