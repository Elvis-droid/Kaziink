import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { Chip, NavBar } from '../components';
import { C, SHADOW } from '../theme';
import { CAT_ICONS, ALL_CATS } from '../data';

export default function WorkerFeedScreen({ go, user, jobs, apps, setSelJob }) {
  const [cat, setCat] = useState('All');
  const cats = ['All', ...ALL_CATS];
  const myApps = apps.filter(a => a.wId === user?.id);
  const appMap = Object.fromEntries(myApps.map(a => [a.jId, a.status]));
  const visible = cat === 'All' ? jobs : jobs.filter(j => j.cat === cat);

  const renderJob = ({ item: job }) => {
    const st = appMap[job.id];
    return (
      <TouchableOpacity
        onPress={() => { setSelJob(job.id); go('worker-job'); }}
        style={s.jobCard} activeOpacity={0.88}>
        {job.img && <Image source={{ uri: job.img }} style={s.jobImg} />}
        <View style={s.jobTop}>
          <View style={s.jobLeft}>
            <Text style={s.jobIcon}>{CAT_ICONS[job.cat] || '💼'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.jobTitle} numberOfLines={1}>{job.title}</Text>
              <Text style={s.jobEmp}>{job.empName}</Text>
            </View>
          </View>
          {st && <Chip text={st === 'pending' ? 'Applied ⏳' : st === 'confirmed' ? 'Confirmed ✓' : st} color={st === 'confirmed' ? 'green' : 'amber'} />}
        </View>
        <Text style={s.jobDesc} numberOfLines={2}>{job.desc}</Text>
        <View style={s.jobBottom}>
          <Text style={s.jobLoc} numberOfLines={1}>📍 {job.loc}</Text>
          <Text style={s.jobPay}>{job.pay}</Text>
        </View>
        <Text style={s.jobDate}>Posted {job.posted}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.appName}>KaziLink</Text>
            <Text style={s.greeting}>Karibu, {user?.firstName || 'Worker'} 👋</Text>
          </View>
          <TouchableOpacity onPress={() => go('worker-profile')} style={s.avatar} activeOpacity={0.8}>
            {user?.photos?.[0]
              ? <Image source={{ uri: user.photos[0] }} style={s.avatarImg} />
              : <Text style={s.avatarIcon}>👷</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
          {cats.map(c => (
            <TouchableOpacity key={c} onPress={() => setCat(c)} style={[s.catChip, cat === c && s.catChipActive]} activeOpacity={0.8}>
              <Text style={[s.catChipTxt, cat === c && s.catChipTxtActive]}>
                {c === 'All' ? '🔍 All' : `${CAT_ICONS[c] || '💼'} ${c}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Jobs List */}
      <FlatList
        data={visible}
        keyExtractor={j => j.id}
        renderItem={renderJob}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <View style={s.listHeader}>
            <Text style={s.listCount}>{visible.length} job{visible.length !== 1 ? 's' : ''} available</Text>
            {myApps.length > 0 && <Chip text={`${myApps.length} applied`} color="teal" />}
          </View>
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🔍</Text>
            <Text style={s.emptyTitle}>No jobs in this category</Text>
            <Text style={s.emptySub}>Check back soon or try another category</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Nav */}
      <NavBar items={[
        { icon: '🏠', label: 'Feed',    active: true,  onPress: () => {} },
        { icon: '📋', label: 'My Jobs', active: false, onPress: () => {} },
        { icon: '👷', label: 'Profile', active: false, onPress: () => go('worker-profile') },
      ]} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { backgroundColor: C.primary, paddingTop: 54, paddingBottom: 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, marginBottom: 14 },
  appName: { fontSize: 22, fontWeight: '900', color: C.white, letterSpacing: -0.5 },
  greeting: { fontSize: 12, color: '#99f6e4', marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#0d9488', borderWidth: 2, borderColor: '#5eead4', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: '100%', height: '100%' },
  avatarIcon: { fontSize: 20 },
  catRow: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
  catChip: { backgroundColor: '#0d9488', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  catChipActive: { backgroundColor: C.accent },
  catChipTxt: { color: '#ccfbf1', fontSize: 12, fontWeight: '700' },
  catChipTxtActive: { color: C.accentDark },
  list: { padding: 16, paddingBottom: 90 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listCount: { fontSize: 13, fontWeight: '700', color: C.textSub },
  jobCard: { backgroundColor: C.white, borderRadius: 20, padding: 16, marginBottom: 12, ...SHADOW.sm },
  jobImg: { width: '100%', height: 140, borderRadius: 14, marginBottom: 12 },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  jobLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginRight: 8 },
  jobIcon: { fontSize: 26 },
  jobTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  jobEmp: { fontSize: 12, fontWeight: '600', color: C.primary, marginTop: 1 },
  jobDesc: { fontSize: 13, color: C.textSub, lineHeight: 19, marginBottom: 10 },
  jobBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobLoc: { fontSize: 12, color: C.textSub, flex: 1 },
  jobPay: { fontSize: 15, fontWeight: '900', color: C.primary },
  jobDate: { fontSize: 11, color: C.textLight, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.textSub },
  emptySub: { fontSize: 13, color: C.textLight, marginTop: 4 },
});
