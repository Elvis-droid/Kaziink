import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Btn, Chip, Card, Banner, ProgressTrack, NavBar } from '../components';
import { C, SHADOW } from '../theme';
import { CAT_ICONS, ALL_CATS } from '../data';

export default function EmployerDashScreen({ go, user, jobs, setJobs, apps, setApps, ping }) {
  const [tab, setTab] = useState('post');
  // Post Job form
  const [title, setTitle]   = useState('');
  const [desc,  setDesc]    = useState('');
  const [loc,   setLoc]     = useState('');
  const [pay,   setPay]     = useState('');
  const [cat,   setCat]     = useState('Cleaning');
  const [jImg,  setJImg]    = useState(null);
  const [showCatPicker, setShowCatPicker] = useState(false);

  const myJobs = jobs.filter(j => j.empId === user?.id);
  const myApps = apps.filter(a => myJobs.some(j => j.id === a.jId));

  const pickJobImg = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed', 'Please allow photo access.');
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });
    if (!res.canceled) setJImg(res.assets[0].uri);
  };

  const postJob = () => {
    if (!title || !desc || !loc || !pay) return Alert.alert('Missing Fields', 'Please fill in all job fields.');
    const j = { id: `j-${Date.now()}`, empId: user.id, empName: `${user.firstName} ${user.surname}`, title, desc, loc, pay, cat, posted: 'Today', img: jImg, status: 'open' };
    setJobs(p => [j, ...p]);
    setTitle(''); setDesc(''); setLoc(''); setPay(''); setJImg(null);
    Alert.alert('✅ Posted!', 'Your job is now live and workers can apply.');
    setTab('jobs');
  };

  const confirmWorker = (appId) => {
    const a = apps.find(x => x.id === appId);
    setApps(p => p.map(x => x.id === appId ? { ...x, status: 'confirmed', progress: 'Confirmed' } : x));
    ping(`MIDDLEMAN ALERT 🔔: Employer "${user.firstName} ${user.surname}" (${user.phone}) confirmed worker "${a.wName}". Please contact both parties to finalise.`);
  };

  const advanceProgress = (appId, step) => {
    setApps(p => p.map(a => a.id === appId ? { ...a, progress: step } : a));
    const a = apps.find(x => x.id === appId);
    if (step === 'Completed') ping(`JOB COMPLETE ✅: Worker "${a.wName}" finished work for "${user.firstName}". Please process payment.`);
  };

  const setRating = (appId, r) => setApps(p => p.map(a => a.id === appId ? { ...a, rating: r } : a));

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.appName}>KaziLink</Text>
            <Text style={s.subName}>Employer: {user?.firstName || '—'}{user?.company ? `  •  ${user.company}` : ''}</Text>
          </View>
          <TouchableOpacity onPress={() => go('emp-profile')} style={s.avatar} activeOpacity={0.8}>
            <Text style={s.avatarIcon}>🏢</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={s.tabBar}>
        {[['post','📝','Post Job'],['jobs','💼','My Jobs'],['track','📊','Track']].map(([k,ic,l]) => (
          <TouchableOpacity key={k} onPress={() => setTab(k)} style={[s.tab, tab===k && s.tabActive]} activeOpacity={0.8}>
            <Text style={s.tabIcon}>{ic}</Text>
            <Text style={[s.tabLabel, tab===k && { color: C.accentMid }]}>{l}</Text>
            {tab===k && <View style={s.tabLine} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── POST JOB ── */}
        {tab === 'post' && (
          <>
            <Banner text="📢  Post a job and qualified workers in your area will apply." color="amber" />
            <Card>
              {/* Title */}
              <Text style={s.fLabel}>JOB TITLE <Text style={{ color: C.error }}>*</Text></Text>
              <TextInput value={title} onChangeText={setTitle} placeholder="e.g. House Cleaning, Security Guard" placeholderTextColor={C.textLight} style={s.input} />

              {/* Category */}
              <Text style={[s.fLabel, { marginTop: 4 }]}>CATEGORY</Text>
              <TouchableOpacity onPress={() => setShowCatPicker(!showCatPicker)} style={s.catBtn} activeOpacity={0.8}>
                <Text style={s.catBtnTxt}>{CAT_ICONS[cat] || '💼'}  {cat}</Text>
                <Text style={{ color: C.textSub }}>▼</Text>
              </TouchableOpacity>
              {showCatPicker && (
                <View style={s.catList}>
                  {ALL_CATS.map(c => (
                    <TouchableOpacity key={c} onPress={() => { setCat(c); setShowCatPicker(false); }} style={[s.catOption, cat===c && s.catOptionActive]}>
                      <Text style={[s.catOptionTxt, cat===c && { color: C.primary, fontWeight:'700' }]}>{CAT_ICONS[c]} {c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Description */}
              <Text style={[s.fLabel, { marginTop: 4 }]}>JOB DESCRIPTION <Text style={{ color: C.error }}>*</Text></Text>
              <TextInput value={desc} onChangeText={setDesc} placeholder="Describe duties, hours, requirements..." placeholderTextColor={C.textLight} multiline numberOfLines={4} style={[s.input, s.inputMulti]} />

              {/* Location */}
              <Text style={[s.fLabel, { marginTop: 4 }]}>LOCATION <Text style={{ color: C.error }}>*</Text></Text>
              <TextInput value={loc} onChangeText={setLoc} placeholder="e.g. Mikocheni, Dar es Salaam" placeholderTextColor={C.textLight} style={s.input} />

              {/* Pay */}
              <Text style={[s.fLabel, { marginTop: 4 }]}>PAY / SALARY <Text style={{ color: C.error }}>*</Text></Text>
              <TextInput value={pay} onChangeText={setPay} placeholder="e.g. TSh 25,000/day or TSh 400,000/month" placeholderTextColor={C.textLight} style={s.input} />

              {/* Image */}
              <Text style={[s.fLabel, { marginTop: 4 }]}>JOB IMAGE (optional)</Text>
              <TouchableOpacity onPress={pickJobImg} style={s.imgPicker} activeOpacity={0.8}>
                {jImg
                  ? <Image source={{ uri: jImg }} style={s.jobImgPreview} />
                  : <><Text style={s.imgPickerIcon}>🖼️</Text><Text style={s.imgPickerTxt}>Tap to add a photo</Text></>
                }
              </TouchableOpacity>

              <TouchableOpacity onPress={postJob} style={s.postBtn} activeOpacity={0.85}>
                <Text style={s.postBtnTxt}>📢  Post This Job</Text>
              </TouchableOpacity>
            </Card>
          </>
        )}

        {/* ── MY JOBS ── */}
        {tab === 'jobs' && (
          <>
            <Text style={s.sectionTitle}>Your posted jobs & applicants</Text>
            {myJobs.length === 0
              ? <View style={s.empty}><Text style={s.emptyIcon}>📭</Text><Text style={s.emptyTxt}>No jobs posted yet</Text><Text style={s.emptySub}>Tap "Post Job" to create your first listing</Text></View>
              : myJobs.map(job => {
                  const jApps = apps.filter(a => a.jId === job.id);
                  return (
                    <Card key={job.id}>
                      <View style={s.jobRow}>
                        <Text style={s.jobCatIcon}>{CAT_ICONS[job.cat] || '💼'}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={s.jobCardTitle}>{job.title}</Text>
                          <Text style={s.jobCardSub}>📍 {job.loc}  ·  {job.pay}</Text>
                        </View>
                      </View>
                      {jApps.length === 0
                        ? <Text style={s.noApps}>No applicants yet.</Text>
                        : jApps.map(a => (
                            <View key={a.id} style={s.applicant}>
                              <View style={s.applicantRow}>
                                <View>
                                  <Text style={s.applicantName}>👷  {a.wName}</Text>
                                  <Text style={s.applicantDate}>Applied: {a.appliedAt}</Text>
                                </View>
                                <Chip text={a.status==='confirmed'?'Confirmed ✓':'Pending'} color={a.status==='confirmed'?'green':'amber'} />
                              </View>
                              {a.status !== 'confirmed'
                                ? <Btn onPress={() => confirmWorker(a.id)} style={{ marginTop: 10 }}>✅  Confirm This Worker</Btn>
                                : <Text style={s.confirmedNote}>✅  KaziLink team notified. They will link you together.</Text>
                              }
                            </View>
                          ))
                      }
                    </Card>
                  );
                })
            }
          </>
        )}

        {/* ── TRACK ── */}
        {tab === 'track' && (
          <>
            <Text style={s.sectionTitle}>Track confirmed workers</Text>
            {myApps.filter(a => a.status === 'confirmed').length === 0
              ? <View style={s.empty}><Text style={s.emptyIcon}>📊</Text><Text style={s.emptyTxt}>No active workers yet</Text><Text style={s.emptySub}>Confirmed workers appear here for tracking</Text></View>
              : myApps.filter(a => a.status === 'confirmed').map(a => {
                  const job  = jobs.find(j => j.id === a.jId);
                  const prog = a.progress || 'Confirmed';
                  const STEPS = ['Confirmed','Arrived','Inspection','Completed'];
                  const next  = STEPS[STEPS.indexOf(prog) + 1];
                  return (
                    <Card key={a.id}>
                      <Text style={s.trackJobTitle}>{job?.title}</Text>
                      <Text style={s.trackWorker}>👷  {a.wName}</Text>
                      <ProgressTrack step={prog} />
                      {prog==='Confirmed' && <Banner text="⏳  Waiting for worker to confirm arrival at your location." color="amber" />}
                      {prog==='Arrived'   && <Btn onPress={() => advanceProgress(a.id,'Inspection')} variant="outline" style={{ marginTop: 8 }}>🔍  Begin Work Inspection</Btn>}
                      {prog==='Inspection' && (
                        <>
                          <Text style={s.rateLabel}>Rate the quality of work:</Text>
                          <View style={s.stars}>
                            {[1,2,3,4,5].map(r => (
                              <TouchableOpacity key={r} onPress={() => setRating(a.id, r)} activeOpacity={0.7}>
                                <Text style={[s.star, (a.rating||0) >= r ? s.starActive : s.starInactive]}>⭐</Text>
                              </TouchableOpacity>
                            ))}
                            {a.rating && <Text style={s.ratingVal}>{a.rating}/5</Text>}
                          </View>
                          <Btn onPress={() => advanceProgress(a.id,'Completed')} style={{ marginTop: 12 }}>✅  Confirm Work Completed</Btn>
                        </>
                      )}
                      {prog==='Completed' && (
                        <View style={s.completedBox}>
                          <Text style={s.completedIcon}>🎉</Text>
                          <Text style={s.completedTxt}>Job Completed!</Text>
                          {a.rating && <Text style={s.completedRating}>{'⭐'.repeat(a.rating)}  {a.rating}/5</Text>}
                          <Text style={s.completedNote}>KaziLink notified to process payment.</Text>
                        </View>
                      )}
                    </Card>
                  );
                })
            }
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      <NavBar activeColor={C.accentMid} items={[
        { icon: '📝', label: 'Post',    active: tab==='post',  onPress: () => setTab('post')  },
        { icon: '💼', label: 'My Jobs', active: tab==='jobs',  onPress: () => setTab('jobs')  },
        { icon: '📊', label: 'Track',   active: tab==='track', onPress: () => setTab('track') },
        { icon: '🏢', label: 'Profile', active: false,         onPress: () => go('emp-profile') },
      ]} />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.background },
  header:       { backgroundColor: C.accentMid, paddingTop: 54, paddingBottom: 14, paddingHorizontal: 18 },
  headerRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appName:      { fontSize: 22, fontWeight: '900', color: C.white },
  subName:      { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  avatar:       { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarIcon:   { fontSize: 20 },
  tabBar:       { flexDirection: 'row', backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
  tab:          { flex: 1, alignItems: 'center', paddingVertical: 10, position: 'relative' },
  tabActive:    {},
  tabIcon:      { fontSize: 18 },
  tabLabel:     { fontSize: 11, fontWeight: '700', color: C.textLight, marginTop: 2 },
  tabLine:      { position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 2, backgroundColor: C.accentMid, borderRadius: 1 },
  content:      { padding: 16 },
  fLabel:       { fontSize: 10, fontWeight: '800', color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  input:        { borderWidth: 2, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: C.text, marginBottom: 14 },
  inputMulti:   { height: 100, textAlignVertical: 'top' },
  catBtn:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 2, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8 },
  catBtnTxt:    { fontSize: 14, color: C.text, fontWeight: '600' },
  catList:      { borderWidth: 1, borderColor: C.border, borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  catOption:    { paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: 1, borderColor: C.borderLight },
  catOptionActive:{ backgroundColor: C.primaryBg },
  catOptionTxt: { fontSize: 14, color: C.text },
  imgPicker:    { borderWidth: 2, borderColor: C.border, borderStyle: 'dashed', borderRadius: 14, padding: 20, alignItems: 'center', marginBottom: 16 },
  imgPickerIcon:{ fontSize: 36 },
  imgPickerTxt: { color: C.textLight, fontSize: 13, marginTop: 6 },
  jobImgPreview:{ width: '100%', height: 140, borderRadius: 10 },
  postBtn:      { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  postBtnTxt:   { fontSize: 15, fontWeight: '800', color: C.accentDark },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: C.textSub, marginBottom: 12 },
  jobRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  jobCatIcon:   { fontSize: 28 },
  jobCardTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  jobCardSub:   { fontSize: 12, color: C.textSub, marginTop: 2 },
  noApps:       { fontSize: 12, color: C.textLight, fontStyle: 'italic', paddingLeft: 4 },
  applicant:    { borderTopWidth: 1, borderColor: C.borderLight, paddingTop: 12, marginTop: 10 },
  applicantRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  applicantName:{ fontSize: 14, fontWeight: '700', color: C.text },
  applicantDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },
  confirmedNote:{ fontSize: 12, color: C.success, fontWeight: '600', marginTop: 8 },
  trackJobTitle:{ fontSize: 16, fontWeight: '800', color: C.text },
  trackWorker:  { fontSize: 13, fontWeight: '700', color: C.primary, marginTop: 2 },
  rateLabel:    { fontSize: 13, fontWeight: '600', color: C.textMid, marginBottom: 8 },
  stars:        { flexDirection: 'row', alignItems: 'center', gap: 4 },
  star:         { fontSize: 28 },
  starActive:   { opacity: 1 },
  starInactive: { opacity: 0.25 },
  ratingVal:    { fontSize: 14, fontWeight: '700', color: C.textSub, marginLeft: 6 },
  completedBox: { backgroundColor: C.successBg, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  completedIcon:{ fontSize: 36, marginBottom: 4 },
  completedTxt: { fontSize: 16, fontWeight: '800', color: C.successText },
  completedRating:{ fontSize: 14, color: C.successText, marginTop: 4 },
  completedNote:{ fontSize: 12, color: C.success, marginTop: 4 },
  empty:        { alignItems: 'center', paddingVertical: 60 },
  emptyIcon:    { fontSize: 52, marginBottom: 12 },
  emptyTxt:     { fontSize: 16, fontWeight: '700', color: C.textSub },
  emptySub:     { fontSize: 13, color: C.textLight, marginTop: 4, textAlign: 'center' },
});
