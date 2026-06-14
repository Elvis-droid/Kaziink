import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Btn, Chip, Banner, ProgressTrack, TopBar } from '../components';
import { C, SHADOW } from '../theme';
import { CAT_ICONS } from '../data';

export default function WorkerJobScreen({ go, selJob, jobs, apps, setApps, user, ping }) {
  const job = jobs.find(j => j.id === selJob);
  if (!job) return (
    <View style={s.center}>
      <Text style={s.notFound}>Job not found</Text>
      <Btn onPress={() => go('worker-feed')}>← Back to Feed</Btn>
    </View>
  );

  const myApp = apps.find(a => a.jId === job.id && a.wId === user?.id);
  const st    = myApp?.status;
  const prog  = myApp?.progress;

  const doApply = () => {
    const a = {
      id: `app-${Date.now()}`, jId: job.id, wId: user.id,
      wName: `${user.firstName || ''} ${user.surname || ''}`.trim(),
      eId: job.empId, status: 'pending', progress: null,
      appliedAt: new Date().toLocaleString(),
    };
    setApps(p => [...p, a]);
    ping(`NEW APPLICATION: Worker "${a.wName}" applied for "${job.title}" by ${job.empName}. Please await employer confirmation.`);
  };

  const doArrival = () => {
    setApps(p => p.map(a => a.id === myApp.id
      ? { ...a, progress: 'Arrived', arrivedAt: new Date().toLocaleTimeString() } : a));
    ping(`ARRIVAL CONFIRMED: Worker "${myApp.wName}" arrived at location for "${job.title}". Employer: ${job.empName}.`);
  };

  return (
    <View style={s.container}>
      <TopBar title="Job Details" onBack={() => go('worker-feed')} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Job Card */}
        <View style={s.jobCard}>
          {job.img && <Image source={{ uri: job.img }} style={s.jobImg} />}
          <View style={s.jobHeader}>
            <Text style={s.jobIcon}>{CAT_ICONS[job.cat] || '💼'}</Text>
            <View style={s.jobMeta}>
              <Text style={s.jobTitle}>{job.title}</Text>
              <Text style={s.jobEmp}>{job.empName}</Text>
              <Text style={s.jobLoc}>📍 {job.loc}</Text>
            </View>
          </View>
          <View style={s.payBox}>
            <Text style={s.payLabel}>PAY / SALARY</Text>
            <Text style={s.payAmt}>{job.pay}</Text>
          </View>
          <Text style={s.jobDesc}>{job.desc}</Text>
          <Text style={s.jobDate}>Posted: {job.posted}</Text>
        </View>

        {/* Apply */}
        {!st && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Ready for this job?</Text>
            <Text style={s.sectionSub}>Tap below to apply. Your profile is sent to the employer for review. KaziLink team will be notified to assist.</Text>
            <Btn onPress={doApply} style={s.actionBtn}>✅  I'm Ready — Apply for This Job</Btn>
          </View>
        )}

        {/* Pending */}
        {st === 'pending' && (
          <View style={[s.section, s.sectionAmber]}>
            <Text style={s.sectionIcon}>⏳</Text>
            <Text style={[s.sectionTitle, { color: C.accentDark }]}>Application Submitted!</Text>
            <Text style={[s.sectionSub, { color: '#92400e' }]}>
              Sent to {job.empName}. Waiting for employer to review and confirm you.
            </Text>
            <Text style={s.kzNote}>✅  KaziLink team has been notified.</Text>
          </View>
        )}

        {/* Confirmed + Progress */}
        {st === 'confirmed' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>🎉  You Are Confirmed!</Text>
            <Text style={s.sectionSub}>The employer confirmed you. KaziLink will contact you with details.</Text>
            <ProgressTrack step={prog || 'Confirmed'} />

            {(!prog || prog === 'Confirmed') && (
              <>
                <Banner text="📍  When you physically arrive at the job location, tap the button below." color="teal" />
                <Btn onPress={doArrival} variant="secondary" style={s.actionBtn}>
                  📍  I Have Arrived at the Workplace
                </Btn>
              </>
            )}
            {prog === 'Arrived' && (
              <Banner text={`✅  Arrival confirmed at ${myApp.arrivedAt}. Employer notified. Begin your work.`} color="green" />
            )}
            {prog === 'Inspection' && (
              <Banner text="🔍  Employer is inspecting your work. Please await feedback." color="teal" />
            )}
            {prog === 'Completed' && (
              <View style={s.completedBox}>
                <Text style={s.completedIcon}>🎉</Text>
                <Text style={s.completedTxt}>Job Complete! Well done. KaziLink will process your payment.</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  notFound: { fontSize: 16, color: C.textSub, marginBottom: 16 },
  content: { padding: 16 },
  jobCard: { backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 14, ...SHADOW.sm },
  jobImg: { width: '100%', height: 160, borderRadius: 14, marginBottom: 14 },
  jobHeader: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  jobIcon: { fontSize: 44 },
  jobMeta: { flex: 1, justifyContent: 'center' },
  jobTitle: { fontSize: 20, fontWeight: '900', color: C.text },
  jobEmp: { fontSize: 13, fontWeight: '700', color: C.primary, marginTop: 2 },
  jobLoc: { fontSize: 12, color: C.textSub, marginTop: 2 },
  payBox: { backgroundColor: C.primaryBg, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 14 },
  payLabel: { fontSize: 10, fontWeight: '800', color: C.primaryMid, letterSpacing: 1, textTransform: 'uppercase' },
  payAmt: { fontSize: 24, fontWeight: '900', color: C.primaryDark, marginTop: 2 },
  jobDesc: { fontSize: 14, color: C.textSub, lineHeight: 22 },
  jobDate: { fontSize: 11, color: C.textLight, marginTop: 10 },
  section: { backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 14, ...SHADOW.sm },
  sectionAmber: { backgroundColor: C.accentBg, borderWidth: 1, borderColor: C.accentLight },
  sectionIcon: { fontSize: 32, marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: C.text, marginBottom: 6 },
  sectionSub: { fontSize: 13, color: C.textSub, lineHeight: 20, marginBottom: 14 },
  kzNote: { fontSize: 12, color: C.primary, fontWeight: '600', marginTop: -6 },
  actionBtn: { marginTop: 4 },
  completedBox: { backgroundColor: C.successBg, borderRadius: 14, padding: 16, alignItems: 'center' },
  completedIcon: { fontSize: 36, marginBottom: 8 },
  completedTxt: { fontSize: 14, fontWeight: '700', color: C.successText, textAlign: 'center' },
});
