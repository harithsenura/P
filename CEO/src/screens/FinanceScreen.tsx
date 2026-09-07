import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { ArrowUpRight, ArrowDownLeft, CreditCard, ChevronRight, Bell, Award, Layers, Calendar, Clock, Activity, Check, Filter } from 'lucide-react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { CEOBackground } from '../components/CEOBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Type Definitions
type Timeframe = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
type Category = 'ALL' | 'INFRA' | 'DESIGN' | 'LEGAL' | 'OPS';

export const FinanceScreen = () => {
  const { theme } = useContext(ThemeContext);

  // Transactions: latest 5 today
  const latestTransactions = [
    { id: 1, title: 'Venture Capital Wire', amount: '+$150,000.00', time: '07:15 AM', category: 'FUNDING', type: 'in' },
    { id: 2, title: 'Stripe: SaaS Subscriptions', amount: '+$8,450.00', time: '11:00 AM', category: 'INCOME', type: 'in' },
    { id: 3, title: 'Design Lab Agency', amount: '-$2,500.00', time: '04:32 PM', category: 'DEV', type: 'out' },
    { id: 4, title: 'Google Cloud Billing', amount: '-$842.10', time: '08:30 AM', category: 'INFRA', type: 'out' },
    { id: 5, title: 'Apple Developer Program', amount: '-$99.00', time: '02:15 PM', category: 'SUBS', type: 'out' },
  ];

  // Payments due today or this week
  const upcomingPayments = [
    { id: 1, title: 'AWS Cloud Infrastructure', amount: '$1,450.00', due: 'DUE TODAY', category: 'INFRA', color: '#ef4444' },
    { id: 2, title: 'HQ Workspace Rent', amount: '$4,200.00', due: 'DUE IN 3 DAYS', category: 'RENT', color: theme.ice },
    { id: 3, title: 'Legal Advisors Retainer', amount: '$15,000.00', due: 'DUE IN 5 DAYS', category: 'LEGAL', color: theme.text2 },
  ];
  
  // Overlay visibility states
  const [isUpcomingVisible, setIsUpcomingVisible] = useState(false);
  const [isPackagesVisible, setIsPackagesVisible] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  // Timeframe and category states for Summary overlay
  const [timeframe, setTimeframe] = useState<Timeframe>('MONTH');
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');

  // Reanimated Translation Shared Values
  const upcomingTranslateX = useSharedValue(SCREEN_WIDTH);
  const packagesTranslateX = useSharedValue(SCREEN_WIDTH);
  const summaryTranslateX = useSharedValue(SCREEN_WIDTH);

  // Trigger Apple-style slide in animations
  const openUpcomingPage = () => {
    setIsUpcomingVisible(true);
    upcomingTranslateX.value = withTiming(0, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
  };

  const closeUpcomingPage = () => {
    upcomingTranslateX.value = withTiming(SCREEN_WIDTH, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setIsUpcomingVisible)(false);
      }
    });
  };

  const openPackagesPage = () => {
    setIsPackagesVisible(true);
    packagesTranslateX.value = withTiming(0, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
  };

  const closePackagesPage = () => {
    packagesTranslateX.value = withTiming(SCREEN_WIDTH, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setIsPackagesVisible)(false);
      }
    });
  };

  const openSummaryPage = () => {
    setIsSummaryVisible(true);
    summaryTranslateX.value = withTiming(0, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
  };

  const closeSummaryPage = () => {
    summaryTranslateX.value = withTiming(SCREEN_WIDTH, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setIsSummaryVisible)(false);
      }
    });
  };

  // Reanimated Animated Styles
  const upcomingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: upcomingTranslateX.value }]
  }));

  const packagesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: packagesTranslateX.value }]
  }));

  const summaryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: summaryTranslateX.value }]
  }));

  // PanResponders for Apple swipe back gesture
  const upcomingPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontal && gestureState.dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          upcomingTranslateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100 || gestureState.vx > 0.4) {
          upcomingTranslateX.value = withTiming(SCREEN_WIDTH, {
            duration: 250,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          }, (finished) => {
            if (finished) {
              runOnJS(setIsUpcomingVisible)(false);
            }
          });
        } else {
          upcomingTranslateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          });
        }
      }
    })
  ).current;

  const packagesPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontal && gestureState.dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          packagesTranslateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100 || gestureState.vx > 0.4) {
          packagesTranslateX.value = withTiming(SCREEN_WIDTH, {
            duration: 250,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          }, (finished) => {
            if (finished) {
              runOnJS(setIsPackagesVisible)(false);
            }
          });
        } else {
          packagesTranslateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          });
        }
      }
    })
  ).current;

  const summaryPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontal && gestureState.dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          summaryTranslateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100 || gestureState.vx > 0.4) {
          summaryTranslateX.value = withTiming(SCREEN_WIDTH, {
            duration: 250,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          }, (finished) => {
            if (finished) {
              runOnJS(setIsSummaryVisible)(false);
            }
          });
        } else {
          summaryTranslateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          });
        }
      }
    })
  ).current;

  // Real-time dynamic mock data sets by timeframe
  const summaryData = {
    DAY: {
      totalSpent: '$941.10',
      income: '+$0.00',
      obligations: '$1,450.00',
      donut: { infra: 0.89, design: 0.0, legal: 0.0, ops: 0.11 },
      bars: [
        { label: '08:00', value: 842.10 },
        { label: '12:00', value: 0.0 },
        { label: '14:00', value: 99.00 },
        { label: '18:00', value: 0.0 },
        { label: '22:00', value: 0.0 }
      ],
      expenses: [
        { title: 'Google Cloud Billing', amount: '$842.10', time: '08:30 AM', category: 'INFRA' },
        { title: 'Apple Developer Program', amount: '$99.00', time: '02:15 PM', category: 'OPS' }
      ]
    },
    WEEK: {
      totalSpent: '$5,141.10',
      income: '+$8,450.00',
      obligations: '$5,650.00',
      donut: { infra: 0.35, design: 0.49, legal: 0.0, ops: 0.16 },
      bars: [
        { label: 'MON', value: 842.10 },
        { label: 'TUE', value: 99.00 },
        { label: 'WED', value: 2500.00 },
        { label: 'THU', value: 1200.00 },
        { label: 'FRI', value: 500.00 }
      ],
      expenses: [
        { title: 'Design Lab Agency', amount: '$2,500.00', time: 'Wed 04:32 PM', category: 'DESIGN' },
        { title: 'AWS Cloud Infrastructure', amount: '$1,200.00', time: 'Thu 10:00 PM', category: 'INFRA' },
        { title: 'Google Cloud Billing', amount: '$842.10', time: 'Mon 08:30 AM', category: 'INFRA' },
        { title: 'Workspace Incidentals', amount: '$500.00', time: 'Fri 03:00 PM', category: 'OPS' },
        { title: 'Apple Developer Program', amount: '$99.00', time: 'Tue 02:15 PM', category: 'OPS' }
      ]
    },
    MONTH: {
      totalSpent: '$18,340.00',
      income: '+$42,500.00',
      obligations: '$21,850.00',
      donut: { infra: 0.45, design: 0.30, legal: 0.15, ops: 0.10 },
      bars: [
        { label: 'W1', value: 2450.00 },
        { label: 'W2', value: 4120.00 },
        { label: 'W3', value: 8450.00 },
        { label: 'W4', value: 3320.00 }
      ],
      expenses: [
        { title: 'Design Lab Agency', amount: '$2,500.00', time: '17 May 04:32 PM', category: 'DESIGN' },
        { title: 'AWS Cloud Infrastructure', amount: '$1,450.00', time: '17 May 10:00 PM', category: 'INFRA' },
        { title: 'Google Cloud Billing', amount: '$842.10', time: '17 May 08:30 AM', category: 'INFRA' },
        { title: 'Legal Retainer Invoice', amount: '$3,500.00', time: '12 May 11:00 AM', category: 'LEGAL' },
        { title: 'Private Marketing Launch', amount: '$5,000.00', time: '10 May 02:00 PM', category: 'DESIGN' },
        { title: 'GitHub Enterprise Team', amount: '$200.00', time: '08 May 09:15 AM', category: 'INFRA' },
        { title: 'SaaS Subscriptions Sync', amount: '$1,840.00', time: '05 May 01:00 PM', category: 'OPS' },
        { title: 'Apple Developer Program', amount: '$99.00', time: '05 May 02:15 PM', category: 'OPS' },
        { title: 'Office Lounge Supplies', amount: '$2,949.00', time: '02 May 04:00 PM', category: 'OPS' }
      ]
    },
    YEAR: {
      totalSpent: '$238,500.00',
      income: '+$510,000.00',
      obligations: '$45,000.00',
      donut: { infra: 0.50, design: 0.20, legal: 0.20, ops: 0.10 },
      bars: [
        { label: 'Q1', value: 54000.00 },
        { label: 'Q2', value: 78000.00 },
        { label: 'Q3', value: 62000.00 },
        { label: 'Q4', value: 44500.00 }
      ],
      expenses: [
        { title: 'Advisory Retainers Stack', amount: '$45,000.00', time: 'April 2026', category: 'LEGAL' },
        { title: 'HQ Custom Design Sprint', amount: '$30,000.00', time: 'March 2026', category: 'DESIGN' },
        { title: 'AWS Cloud Scale Reserve', amount: '$24,000.00', time: 'Jan-May 2026', category: 'INFRA' },
        { title: 'SaaS Suite Total Cost', amount: '$18,400.00', time: 'Jan-May 2026', category: 'OPS' },
        { title: 'Operations Travel Log', amount: '$12,500.00', time: 'Feb 2026', category: 'OPS' },
        { title: 'Consultancy Retainer Fee', amount: '$108,600.00', time: 'Jan-May 2026', category: 'INFRA' }
      ]
    }
  };

  // Filtered expenses based on selected Category inside the selected timeframe
  const getFilteredExpenses = () => {
    const currentList = summaryData[timeframe].expenses;
    if (selectedCategory === 'ALL') {
      return currentList;
    }
    return currentList.filter(item => item.category === selectedCategory);
  };

  return (
    <View style={styles.container}>
      <CEOBackground />
      <ScreenHeader title="Finances" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TOTAL BALANCE HEADER */}
        <GlassCard style={styles.balanceCard}>
          <Text style={[styles.sectionTitleLabel, { color: theme.text2 }]}>TOTAL WEALTH</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 8 }}>
            <Text style={[styles.balanceSymbol, { color: theme.ice }]}>$</Text>
            <Text style={[styles.balanceValue, { color: theme.text }]}>458,230</Text>
            <Text style={[styles.balanceCents, { color: theme.ice }]}>.50</Text>
          </View>

          {/* Monthly Income and Expenses (Small-sized) */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <ArrowDownLeft color="#10b981" size={12} />
                <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 9, color: theme.text2, letterSpacing: 0.5 }}>MONTHLY INCOME</Text>
              </View>
              <Text style={[styles.statVal, { color: '#10b981' }]}>+$42,500.00</Text>
            </View>

            <View style={[styles.statCol, { alignItems: 'flex-end' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 9, color: theme.text2, letterSpacing: 0.5 }}>MONTHLY EXPENSES</Text>
                <ArrowUpRight color="#ef4444" size={12} />
              </View>
              <Text style={[styles.statVal, { color: '#ef4444' }]}>-$18,340.00</Text>
            </View>
          </View>
        </GlassCard>

        {/* 3 ACTION BUTTONS (UPCOMING, PACKAGES, SUMMARY) */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            onPress={openUpcomingPage} 
            style={[
              styles.actionBtn, 
              { backgroundColor: theme.surface2, borderColor: theme.border + '30' }
            ]}
          >
            <Bell size={12} color={theme.text2} style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: theme.text2 }]}>UPCOMING</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={openPackagesPage} 
            style={[
              styles.actionBtn, 
              { backgroundColor: theme.surface2, borderColor: theme.border + '30' }
            ]}
          >
            <Award size={12} color={theme.text2} style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: theme.text2 }]}>PACKAGES</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={openSummaryPage} 
            style={[
              styles.actionBtn, 
              { backgroundColor: theme.surface2, borderColor: theme.border + '30' }
            ]}
          >
            <Layers size={12} color={theme.text2} style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: theme.text2 }]}>SUMMARY</Text>
          </TouchableOpacity>
        </View>

        {/* CREDIT CARDS HORIZONTAL SCROLLVIEW */}
        <Text style={[styles.sectionTitle, { color: theme.text2, marginBottom: 8 }]}>CREDIT DECK</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          decelerationRate="fast" 
          snapToInterval={292} 
          contentContainerStyle={{ paddingRight: 12, marginBottom: 20 }}
        >
          {/* Card 1 */}
          <GlassCard style={[styles.creditCard, { borderColor: theme.ice + '40' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10, color: theme.text2, letterSpacing: 1.5 }}>BLACK PLATINUM</Text>
              <CreditCard color={theme.ice} size={18} />
            </View>
            <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 19, color: theme.text, letterSpacing: 2, marginBottom: 12 }}>
              ••••  ••••  ••••  8820
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 8, color: theme.text2, letterSpacing: 0.5 }}>BALANCE</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 15, color: theme.text }}>$384,100.00</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 8, color: theme.text2, letterSpacing: 0.5 }}>EXPIRY</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11, color: theme.text }}>12/28</Text>
              </View>
            </View>
          </GlassCard>

          {/* Card 2 */}
          <GlassCard style={[styles.creditCard, { borderColor: '#10b981' + '40' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10, color: theme.text2, letterSpacing: 1.5 }}>ICE CORPORATE</Text>
              <CreditCard color="#10b981" size={18} />
            </View>
            <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 19, color: theme.text, letterSpacing: 2, marginBottom: 12 }}>
              ••••  ••••  ••••  4099
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 8, color: theme.text2, letterSpacing: 0.5 }}>BALANCE</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 15, color: theme.text }}>$59,930.50</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 8, color: theme.text2, letterSpacing: 0.5 }}>EXPIRY</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11, color: theme.text }}>06/29</Text>
              </View>
            </View>
          </GlassCard>

          {/* Card 3 */}
          <GlassCard style={[styles.creditCard, { borderColor: '#eab308' + '40' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10, color: theme.text2, letterSpacing: 1.5 }}>GOLD EXECUTIVE</Text>
              <CreditCard color="#eab308" size={18} />
            </View>
            <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 19, color: theme.text, letterSpacing: 2, marginBottom: 12 }}>
              ••••  ••••  ••••  1770
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 8, color: theme.text2, letterSpacing: 0.5 }}>BALANCE</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 15, color: theme.text }}>$14,200.00</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 8, color: theme.text2, letterSpacing: 0.5 }}>EXPIRY</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11, color: theme.text }}>08/30</Text>
              </View>
            </View>
          </GlassCard>
        </ScrollView>

        {/* PAYMENTS DUE THIS WEEK */}
        <Text style={[styles.sectionTitle, { color: theme.text2 }]}>PAYMENTS DUE THIS WEEK</Text>
        <View style={{ gap: 10, marginBottom: 20 }}>
          {upcomingPayments.map(payment => (
            <GlassCard key={payment.id} style={[styles.paymentCard, { borderColor: payment.color + '30' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[styles.paymentTitle, { color: theme.text }]}>{payment.title}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 4 }}>
                    <View style={[styles.categoryBadge, { borderColor: theme.border + '30' }]}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: theme.text2 }}>{payment.category}</Text>
                    </View>
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: payment.color }}>{payment.due}</Text>
                  </View>
                </View>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 15, color: theme.text }}>{payment.amount}</Text>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* LATEST 5 TRANSACTIONS TODAY */}
        <Text style={[styles.sectionTitle, { color: theme.text2 }]}>LATEST TRANSACTIONS TODAY</Text>
        <View style={{ gap: 10 }}>
          {latestTransactions.map(tx => (
            <GlassCard key={tx.id} style={styles.txCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[
                    styles.txIconContainer, 
                    { backgroundColor: tx.type === 'in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
                  ]}>
                    {tx.type === 'in' ? (
                      <ArrowDownLeft color="#10b981" size={16} />
                    ) : (
                      <ArrowUpRight color="#ef4444" size={16} />
                    )}
                  </View>
                  <View>
                    <Text style={[styles.txTitle, { color: theme.text }]}>{tx.title}</Text>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 2 }}>
                      <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 9, color: theme.text2 }}>{tx.time}</Text>
                      <View style={[styles.categoryBadge, { borderColor: theme.border + '30' }]}>
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: theme.text2 }}>{tx.category}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={[
                  styles.txAmount, 
                  { color: tx.type === 'in' ? '#10b981' : theme.text }
                ]}>
                  {tx.amount}
                </Text>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      {/* ========================================== */}
      {/* 1. UPCOMING PAYMENTS SCREEN OVERLAY */}
      {/* ========================================== */}
      {isUpcomingVisible && (
        <Animated.View 
          style={[styles.detailOverlay, upcomingAnimatedStyle, { backgroundColor: theme.bg }]}
          {...upcomingPanResponder.panHandlers}
        >
          <CEOBackground />
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={closeUpcomingPage} style={[styles.backBtn, { borderColor: theme.border }]}>
              <Text style={{ color: theme.ice, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11 }}>◀ BACK</Text>
            </TouchableOpacity>
            <Text style={[styles.overlayTitle, { color: theme.text }]}>CASHFLOW TIMELINE</Text>
            <View style={{ width: 68 }} />
          </View>

          <ScrollView contentContainerStyle={styles.overlayScroll} showsVerticalScrollIndicator={false}>
            <GlassCard style={styles.analysisCard}>
              <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: theme.text2, letterSpacing: 1 }}>CASHFLOW OBLIGATIONS</Text>
              <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 32, color: theme.text, marginTop: 8 }}>$21,850.00</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <Clock color={theme.ice} size={12} />
                <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: theme.text2 }}>Next obligation due in 2 hours</Text>
              </View>
              <View style={[styles.progressBarContainer, { backgroundColor: theme.surface2 }]}>
                <View style={[styles.progressBarFill, { width: '85%', backgroundColor: theme.ice }]} />
              </View>
              <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 9, color: theme.ice, alignSelf: 'flex-end', marginTop: 4 }}>85% LIQUIDITY COVERED</Text>
            </GlassCard>

            <Text style={[styles.sectionTitle, { color: theme.text2, marginTop: 12 }]}>MAY CHRONOLOGICAL SCHEDULE</Text>
            
            <GlassCard style={{ padding: 16 }}>
              {[
                { title: 'AWS Cloud Infrastructure', amount: '$1,450.00', due: 'TODAY', time: '10:00 PM', desc: 'Compute / RDS Auto-billing', paid: false },
                { title: 'Slack Team Suite Renewal', amount: '$640.00', due: 'MAY 21', time: '09:00 AM', desc: 'Corporate communication seat pack', paid: false },
                { title: 'HQ Premium Workspace Rent', amount: '$4,200.00', due: 'MAY 23', time: '12:00 PM', desc: 'Private Suite A, 5th Floor', paid: false },
                { title: 'Legal Advisors Retainer Q2', amount: '$15,000.00', due: 'MAY 25', time: '05:00 PM', desc: 'Operations & Venture Capital council', paid: false },
                { title: 'Figma Enterprise Seats', amount: '$360.00', due: 'MAY 28', time: '08:00 AM', desc: 'Creative team seat pack', paid: true },
                { title: 'GitHub Enterprise Teams', amount: '$200.00', due: 'MAY 30', time: '11:00 AM', desc: 'Engineering code storage & actions', paid: true }
              ].map((item, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.timelineRow, 
                    idx !== 5 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={[styles.timelineItemTitle, { color: theme.text }]}>{item.title}</Text>
                      <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 10, color: theme.text2, marginTop: 2 }}>{item.desc}</Text>
                    </View>
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 14, color: theme.text }}>{item.amount}</Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Calendar color={theme.ice} size={10} />
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: theme.ice }}>{item.due}</Text>
                      <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 9, color: theme.text2 }}>• {item.time}</Text>
                    </View>

                    <View style={[
                      styles.statusBadge, 
                      { borderColor: item.paid ? '#10b981' : item.due === 'TODAY' ? '#ef4444' : theme.text2 + '40' }
                    ]}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: item.paid ? '#10b981' : item.due === 'TODAY' ? '#ef4444' : theme.text2 }}>
                        {item.paid ? 'PAID ✓' : 'UNPAID'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </GlassCard>
          </ScrollView>
        </Animated.View>
      )}

      {/* ========================================== */}
      {/* 2. PACKAGES SCREEN OVERLAY */}
      {/* ========================================== */}
      {isPackagesVisible && (
        <Animated.View 
          style={[styles.detailOverlay, packagesAnimatedStyle, { backgroundColor: theme.bg }]}
          {...packagesPanResponder.panHandlers}
        >
          <CEOBackground />
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={closePackagesPage} style={[styles.backBtn, { borderColor: theme.border }]}>
              <Text style={{ color: theme.ice, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11 }}>◀ BACK</Text>
            </TouchableOpacity>
            <Text style={[styles.overlayTitle, { color: theme.text }]}>ACTIVE PACKAGES</Text>
            <View style={{ width: 68 }} />
          </View>

          <ScrollView contentContainerStyle={styles.overlayScroll} showsVerticalScrollIndicator={false}>
            <GlassCard style={styles.analysisCard}>
              <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: theme.text2, letterSpacing: 1 }}>RECURRING SAAS SPENT</Text>
              <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 32, color: theme.text, marginTop: 8 }}>$1,840.00<Text style={{ fontSize: 16, color: theme.ice }}>/mo</Text></Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <Activity color={theme.ice} size={12} />
                <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: theme.text2 }}>8 Platforms integrated natively</Text>
              </View>
              
              <View style={styles.multiBar}>
                <View style={{ flex: 45, backgroundColor: theme.ice }} />
                <View style={{ flex: 35, backgroundColor: '#10b981' }} />
                <View style={{ flex: 20, backgroundColor: '#eab308' }} />
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: theme.ice }}>DEV: 45%</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: '#10b981' }}>DESIGN: 35%</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: '#eab308' }}>OPS: 20%</Text>
              </View>
            </GlassCard>

            <Text style={[styles.sectionTitle, { color: theme.text2, marginTop: 12 }]}>OPERATIONAL BUNDLES & LICENSES</Text>

            <View style={{ gap: 12 }}>
              {[
                { name: 'OpenAI API Scale Pack', cost: '$1,200/mo', status: 'ACTIVE', color: theme.ice, usage: '82% of tokens used', icon: '🤖' },
                { name: 'Figma Design Team Suite', cost: '$360/mo', status: 'ACTIVE', color: '#10b981', usage: 'All seats occupied', icon: '🎨' },
                { name: 'Vercel Enterprise Tier', cost: '$150/mo', status: 'ACTIVE', color: '#eab308', usage: '40% bandwidth used', icon: '⚡' },
                { name: 'Google Workspace Bundle', cost: '$130/mo', status: 'ACTIVE', color: theme.text2, usage: 'Admin console verified', icon: '📧' }
              ].map((pack, idx) => (
                <GlassCard key={idx} style={[styles.packItemCard, { borderColor: pack.color + '40' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
                      <Text style={{ fontSize: 20 }}>{pack.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.packName, { color: theme.text }]}>{pack.name}</Text>
                        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 9, color: theme.text2, marginTop: 3 }}>
                          Usage: {pack.usage}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 14, color: theme.text }}>{pack.cost}</Text>
                      <View style={[styles.statusBadge, { borderColor: '#10b981', marginTop: 6, backgroundColor: 'rgba(16, 185, 129, 0.05)' }]}>
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: '#10b981' }}>{pack.status}</Text>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {/* ========================================== */}
      {/* 3. ADVANCED SUMMARY SCREEN OVERLAY */}
      {/* ========================================== */}
      {isSummaryVisible && (
        <Animated.View 
          style={[styles.detailOverlay, summaryAnimatedStyle, { backgroundColor: theme.bg }]}
          {...summaryPanResponder.panHandlers}
        >
          <CEOBackground />
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={closeSummaryPage} style={[styles.backBtn, { borderColor: theme.border }]}>
              <Text style={{ color: theme.ice, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11 }}>◀ BACK</Text>
            </TouchableOpacity>
            <Text style={[styles.overlayTitle, { color: theme.text }]}>ADVANCED SUMMARY</Text>
            <View style={{ width: 68 }} />
          </View>

          {/* TIMEFRAME TAB BAR (DAY, WEEK, MONTH, YEAR) */}
          <View style={styles.timeframeTabBar}>
            {(['DAY', 'WEEK', 'MONTH', 'YEAR'] as Timeframe[]).map((tab) => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => {
                  setTimeframe(tab);
                  setSelectedCategory('ALL'); // Reset filter when shifting timeframe
                }}
                style={[
                  styles.timeframeTabBtn, 
                  timeframe === tab && { borderBottomColor: theme.ice, borderBottomWidth: 2 }
                ]}
              >
                <Text style={[
                  styles.timeframeTabText, 
                  { color: timeframe === tab ? theme.ice : theme.text2 }
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.overlayScroll} showsVerticalScrollIndicator={false}>
            
            {/* CASHFLOW KPI SUMMARY WIDGET */}
            <GlassCard style={styles.kpiCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 9, color: theme.text2, letterSpacing: 1 }}>TOTAL EXPENDITURE</Text>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 26, color: theme.text, marginTop: 4 }}>
                    {summaryData[timeframe].totalSpent}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 9, color: theme.text2, letterSpacing: 1 }}>TIME INCOME</Text>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 16, color: '#10b981', marginTop: 4 }}>
                    {summaryData[timeframe].income}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* CHARTS CONTAINER GRID */}
            <View style={styles.chartsGrid}>
              
              {/* DONUT PIE CHART (CATEGORY SEGMENTS) */}
              <GlassCard style={[styles.chartBox, { flex: 1 }]}>
                <Text style={styles.chartBoxTitle}>CATEGORY DONUT</Text>
                <View style={styles.donutContainer}>
                  {/* SVG Pie/Donut Chart */}
                  <Svg width="120" height="120" viewBox="0 0 120 120">
                    <G transform="rotate(-90 60 60)">
                      {/* Grey Base Ring */}
                      <Circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                      
                      {/* Segment 1: INFRA */}
                      {summaryData[timeframe].donut.infra > 0 && (
                        <Circle 
                          cx="60" 
                          cy="60" 
                          r="45" 
                          fill="none" 
                          stroke={theme.ice} 
                          strokeWidth="12" 
                          strokeDasharray="282.74" 
                          strokeDashoffset={282.74 * (1 - summaryData[timeframe].donut.infra)} 
                        />
                      )}

                      {/* Segment 2: DESIGN */}
                      {summaryData[timeframe].donut.design > 0 && (
                        <Circle 
                          cx="60" 
                          cy="60" 
                          r="45" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="12" 
                          strokeDasharray="282.74" 
                          strokeDashoffset={282.74 * (1 - summaryData[timeframe].donut.design)}
                          transform={`rotate(${360 * summaryData[timeframe].donut.infra} 60 60)`}
                        />
                      )}

                      {/* Segment 3: LEGAL */}
                      {summaryData[timeframe].donut.legal > 0 && (
                        <Circle 
                          cx="60" 
                          cy="60" 
                          r="45" 
                          fill="none" 
                          stroke="#eab308" 
                          strokeWidth="12" 
                          strokeDasharray="282.74" 
                          strokeDashoffset={282.74 * (1 - summaryData[timeframe].donut.legal)}
                          transform={`rotate(${360 * (summaryData[timeframe].donut.infra + summaryData[timeframe].donut.design)} 60 60)`}
                        />
                      )}

                      {/* Segment 4: OPS */}
                      {summaryData[timeframe].donut.ops > 0 && (
                        <Circle 
                          cx="60" 
                          cy="60" 
                          r="45" 
                          fill="none" 
                          stroke="rgba(255,255,255,0.25)" 
                          strokeWidth="12" 
                          strokeDasharray="282.74" 
                          strokeDashoffset={282.74 * (1 - summaryData[timeframe].donut.ops)}
                          transform={`rotate(${360 * (summaryData[timeframe].donut.infra + summaryData[timeframe].donut.design + summaryData[timeframe].donut.legal)} 60 60)`}
                        />
                      )}
                    </G>
                  </Svg>
                  
                  {/* Total Value text placed in the center of the Donut */}
                  <View style={styles.donutCenterText}>
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11, color: theme.text }}>
                      {summaryData[timeframe].totalSpent.split('.')[0]}
                    </Text>
                    <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 7, color: theme.text2, letterSpacing: 0.5 }}>SPENT</Text>
                  </View>
                </View>

                {/* Donut Legend */}
                <View style={styles.donutLegend}>
                  <View style={styles.legendRow}>
                    <View style={[styles.legendIndicator, { backgroundColor: theme.ice }]} />
                    <Text style={[styles.legendText, { color: theme.text }]}>INFRA: {Math.round(summaryData[timeframe].donut.infra * 100)}%</Text>
                  </View>
                  <View style={styles.legendRow}>
                    <View style={[styles.legendIndicator, { backgroundColor: '#10b981' }]} />
                    <Text style={[styles.legendText, { color: theme.text }]}>DESIGN: {Math.round(summaryData[timeframe].donut.design * 100)}%</Text>
                  </View>
                  <View style={styles.legendRow}>
                    <View style={[styles.legendIndicator, { backgroundColor: '#eab308' }]} />
                    <Text style={[styles.legendText, { color: theme.text }]}>LEGAL: {Math.round(summaryData[timeframe].donut.legal * 100)}%</Text>
                  </View>
                  {summaryData[timeframe].donut.ops > 0 && (
                    <View style={styles.legendRow}>
                      <View style={[styles.legendIndicator, { backgroundColor: 'rgba(255,255,255,0.25)' }]} />
                      <Text style={[styles.legendText, { color: theme.text }]}>OPS: {Math.round(summaryData[timeframe].donut.ops * 100)}%</Text>
                    </View>
                  )}
                </View>
              </GlassCard>

              {/* VERTICAL BAR CHART (Obligations & Flows) */}
              <GlassCard style={[styles.chartBox, { flex: 1 }]}>
                <Text style={styles.chartBoxTitle}>TIMELINE PROGRESS</Text>
                
                <View style={styles.barChartContainer}>
                  {summaryData[timeframe].bars.map((bar, idx) => {
                    const maxVal = Math.max(...summaryData[timeframe].bars.map(b => b.value), 1);
                    const percentHeight = `${(bar.value / maxVal) * 80 + 5}%`; // limit to max 85% container height
                    
                    return (
                      <View key={idx} style={styles.barCol}>
                        <View style={styles.barTrack}>
                          <View style={[styles.barFill, { height: percentHeight as any, backgroundColor: theme.ice }]} />
                        </View>
                        <Text style={[styles.barLabel, { color: theme.text2 }]}>{bar.label}</Text>
                        <Text style={[styles.barValueText, { color: theme.text }]}>
                          {bar.value > 1000 ? `$${(bar.value / 1000).toFixed(1)}k` : `$${Math.round(bar.value)}`}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </GlassCard>
            </View>

            {/* CATEGORY INTERACTIVE SELECTOR (expences list ekath adala catergory ekata adalava balaganna puluvn venna) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 12 }}>
              <Text style={[styles.sectionTitle, { color: theme.text2, marginBottom: 0 }]}>FILTER EXPENSES BY CATEGORY</Text>
              <Filter color={theme.ice} size={14} />
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.categoryFilterRow}
            >
              {(['ALL', 'INFRA', 'DESIGN', 'LEGAL', 'OPS'] as Category[]).map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.filterTabBtn, 
                    { backgroundColor: theme.surface2 },
                    selectedCategory === cat && { borderColor: theme.ice, borderWidth: 1.5 }
                  ]}
                >
                  <Text style={[
                    styles.filterTabText, 
                    { color: selectedCategory === cat ? theme.ice : theme.text2 }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* FILTERED TRANSACTION / EXPENSE LIST ITEMS */}
            <View style={{ gap: 10, marginTop: 12 }}>
              {getFilteredExpenses().length > 0 ? (
                getFilteredExpenses().map((item, idx) => (
                  <GlassCard key={idx} style={styles.txCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <Text style={[styles.txTitle, { color: theme.text }]}>{item.title}</Text>
                        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 4 }}>
                          <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 9, color: theme.text2 }}>{item.time}</Text>
                          <View style={[styles.categoryBadge, { borderColor: theme.border + '30' }]}>
                            <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: theme.text2 }}>{item.category}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 14.5, color: '#ef4444' }}>
                        -{item.amount}
                      </Text>
                    </View>
                  </GlassCard>
                ))
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 12, color: theme.text2 }}>
                    NO OBLIGATIONS RECORDED FOR {selectedCategory}
                  </Text>
                </View>
              )}
            </View>

          </ScrollView>
        </Animated.View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 120 },
  balanceCard: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleLabel: {
    fontFamily: 'Syne_700Bold',
    fontSize: 9,
    letterSpacing: 2,
  },
  balanceSymbol: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 24,
    marginRight: 4,
  },
  balanceValue: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 38,
  },
  balanceCents: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  statCol: {
    flex: 1,
    gap: 4,
  },
  statVal: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 13,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionBtnText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  creditCard: {
    width: 280,
    marginRight: 12,
    padding: 20,
    borderWidth: 1.5,
  },
  paymentCard: {
    padding: 16,
    borderWidth: 1.5,
  },
  paymentTitle: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 13.5,
  },
  categoryBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  txCard: {
    padding: 16,
  },
  txIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 13.5,
  },
  txAmount: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 14.5,
  },
  
  // OVERLAY SCREEN STYLES
  detailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  overlayTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  overlayScroll: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 120,
  },
  analysisCard: {
    padding: 20,
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  multiBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  timelineRow: {
    paddingVertical: 14,
  },
  timelineItemTitle: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 13,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  packItemCard: {
    padding: 16,
    borderWidth: 1.5,
  },
  packName: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 13.5,
  },

  // SUMMARY SCREEN EXTRAS
  timeframeTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  timeframeTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeframeTabText: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 11,
    letterSpacing: 1,
  },
  kpiCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  chartBox: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartBoxTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  donutContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutLegend: {
    width: '100%',
    marginTop: 12,
    gap: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 8.5,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    width: '100%',
    paddingBottom: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 10,
    height: '70%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
  },
  barLabel: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 7.5,
    marginTop: 6,
  },
  barValueText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 7,
    marginTop: 2,
  },
  categoryFilterRow: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 4,
  },
  filterTabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabText: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  emptyStateContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
