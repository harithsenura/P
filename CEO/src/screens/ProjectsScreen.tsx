import React, { useContext, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, PanResponder, Image, Linking, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { 
  Award, Zap, Code, Shield, Cpu, ExternalLink, Activity, Sparkles, 
  Globe, Plus, Image as ImageIcon,
  CheckCircle2, Clock, Loader, XCircle, ArrowUpRight,
  PhoneCall, Terminal, GitBranch, FolderGit, Map, ListTodo,
  MessageSquare, Send, Link
} from 'lucide-react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { CEOBackground } from '../components/CEOBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Commit {
  hash: string;
  msg: string;
  time: string;
  author: string;
}

interface Client {
  id: number;
  name: string;
  service: string;
  status: string;
  color: string;
  phone: string;
  projectTitle: string;
  projectDesc: string;
  progress: number;
  focusTime: string;
  price: string;
  repository: string;
  commits: Commit[];
}

interface Skill {
  id: number;
  name: string;
  level: string;
  progress: number;
  lastWorked: string;
  focusTime: string;
  tags: string[];
  color: string;
  bio: string;
  icon: React.ReactNode;
}

interface SWEProject {
  id: number;
  name: string;
  service: string;
  status: string;
  color: string;
  price: string;
  progress: number;
  focusTime: string;
  repository: string;
  documentation: string[];
  plan: string[];
  checklist: Array<{ task: string; completed: boolean }>;
  commits: Commit[];
  marketingMetric: string;
}

export const ProjectsScreen = () => {
  const { theme } = useContext(ThemeContext);
  
  // Overlay Visibility States
  const [isVerstackVisible, setIsVerstackVisible] = useState(false);
  const [isClientVisible, setIsClientVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Software Engineering Overlay states
  const [isSWEVisible, setIsSWEVisible] = useState(false);
  const [selectedSWEProject, setSelectedSWEProject] = useState<SWEProject | null>(null);
  const [isSWEProjectVisible, setIsSWEProjectVisible] = useState(false);
  
  // Custom Dynamic Client Logos and Documents Vault State
  const [clientLogos, setClientLogos] = useState<Record<number, string>>({});
  const [clientDocs, setClientDocs] = useState<Record<number, Array<{ id: string; name: string; date: string }>>>({
    1: [
      { id: 'doc-1', name: 'apex_liquidity_architecture_v1.pdf', date: 'MAY 12, 2026' },
      { id: 'doc-2', name: 'smart_contract_escrow_audit.enc', date: 'MAY 15, 2026' }
    ],
    2: [
      { id: 'doc-3', name: 'veloce_investment_agreement_signed.pdf', date: 'MAY 10, 2026' }
    ],
    3: [
      { id: 'doc-4', name: 'titan_gas_compiler_specification.pdf', date: 'MAY 14, 2026' }
    ]
  });

  // Dynamic Payments Ledger State
  const [isShowPayments, setIsShowPayments] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneAmount, setNewMilestoneAmount] = useState('');

  const [clientPayments, setClientPayments] = useState<Record<number, Array<{ id: string; milestone: string; amount: string; status: 'PAID' | 'PENDING' }>>>({
    1: [
      { id: 'pay-1', milestone: 'UI/UX Design Signoff', amount: '$8,500', status: 'PAID' },
      { id: 'pay-2', milestone: 'API Middleware Deploy', amount: '$15,000', status: 'PAID' },
      { id: 'pay-3', milestone: 'Final Audit Release', amount: '$11,500', status: 'PENDING' }
    ],
    2: [
      { id: 'pay-4', milestone: 'Cap-Table Algorithm Signoff', amount: '$12,000', status: 'PAID' },
      { id: 'pay-5', milestone: 'Mainnet Integration release', amount: '$18,000', status: 'PENDING' }
    ],
    3: [
      { id: 'pay-6', milestone: 'Solidity Compiler Core deploy', amount: '$45,000', status: 'PAID' }
    ]
  });

  // Reanimated Translation Shared Values
  const verstackTranslateX = useSharedValue(SCREEN_WIDTH);
  const clientTranslateX = useSharedValue(SCREEN_WIDTH);
  const sweTranslateX = useSharedValue(SCREEN_WIDTH);
  const sweProjectTranslateX = useSharedValue(SCREEN_WIDTH);

  // Task category counts
  const [taskCounts, setTaskCounts] = useState({
    complete: 28,
    pending: 3,
    inProcess: 5,
    canceled: 1
  });

  // Client Details list with full operational metadata
  const clients: Client[] = [
    { 
      id: 1, 
      name: 'Apex Quant Fund', 
      service: 'Enterprise Site & API Orchestration', 
      status: 'ACTIVE', 
      color: theme.ice,
      phone: '+1-800-555-APEX',
      projectTitle: 'Quant Trading Engine Dashboard',
      projectDesc: 'Institutional grade trading analytics dashboard and secure API middleware with real-time liquidity pool sweeps, deep orderbook aggregators, and minimal memory processing footprint.',
      progress: 85,
      focusTime: '184 Hours',
      price: '$35,000.00',
      repository: 'github.com/verstack/apex-quant-suite',
      commits: [
        { hash: 'a9d2f01', msg: 'feat(core): optimized high-frequency WebSocket frames parse loop', time: '2 hrs ago', author: 'Harith' },
        { hash: 'e4c8920', msg: 'refactor(ui): redesigned orderbook depth layout & canvas charts', time: 'Yesterday', author: 'Harith' },
        { hash: 'b1a2099', msg: 'fix(auth): resolved JWT session bypass vulnerability inside edge API', time: '3 days ago', author: 'Harith' },
        { hash: 'f6d4e8c', msg: 'perf(cache): integrated local storage state sync optimizations', time: '5 days ago', author: 'Harith' }
      ]
    },
    { 
      id: 2, 
      name: 'Veloce Venture Capital', 
      service: 'Investor Dealroom Dashboard', 
      status: 'ACTIVE', 
      color: '#eab308',
      phone: '+1-800-555-VELO',
      projectTitle: 'Dealroom Secure Executive Portal',
      projectDesc: 'Premium venture portal with absolute AES document room encryption, automated cap-table allocation formulas, and multi-tenant investor subscription pipelines.',
      progress: 60,
      focusTime: '92 Hours',
      price: '$30,000.00',
      repository: 'github.com/verstack/veloce-dealroom',
      commits: [
        { hash: 'c8f7a22', msg: 'feat(security): integrated multi-layered document encryption algorithm', time: '5 hrs ago', author: 'Harith' },
        { hash: 'd9b01c3', msg: 'docs(api): documented tokenized private fund distribution schemas', time: '2 days ago', author: 'Harith' },
        { hash: 'e5a1198', msg: 'feat(charts): implemented SVG cap-table segment breakdown ring', time: '4 days ago', author: 'Harith' }
      ]
    },
    { 
      id: 3, 
      name: 'Titan Security Labs', 
      service: 'Smart Contract Penetration Hub', 
      status: 'COMPLETED', 
      color: '#10b981',
      phone: '+1-800-555-TITN',
      projectTitle: 'Solidity Compiler static-analysis suite',
      projectDesc: 'Gas optimization audit tool and reentrancy threat detector compiling Smart Contracts into semantic AST trees to safeguard enterprise decentralized assets.',
      progress: 100,
      focusTime: '340 Hours',
      price: '$45,000.00',
      repository: 'github.com/verstack/titan-sol-scanner',
      commits: [
        { hash: 'f10ba82', msg: 'release(v1.0.0): officially deployed stable solidity scanner core', time: 'Yesterday', author: 'Harith' },
        { hash: 'a3d2c88', msg: 'feat(wasm): compiled core syntax parser into WebAssembly binary', time: '3 days ago', author: 'Harith' },
        { hash: 'd5c2e11', msg: 'fix(parser): solved nested fallback loops parsing timeouts', time: '5 days ago', author: 'Harith' }
      ]
    }
  ];

  // Task history data logs
  const taskHistory = [
    { id: 1, task: 'Integrated Stripe multi-subscription system', time: '10 Hours', date: 'MAY 16, 2026', status: 'COMPLETE', color: '#10b981' },
    { id: 2, task: 'Configured Cloudflare DNS & enterprise edge routing', time: '6 Hours', date: 'MAY 14, 2026', status: 'COMPLETE', color: '#10b981' },
    { id: 3, task: 'Engineered dark mode & React Native Reanimated stack', time: '24 Hours', date: 'MAY 12, 2026', status: 'COMPLETE', color: '#10b981' },
    { id: 4, task: 'Refactored state flow architecture to prevent bridge freezes', time: '15 Hours', date: 'MAY 09, 2026', status: 'COMPLETE', color: '#10b981' }
  ];

  // Image Picker Logic (Local Storage Upload)
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera roll permissions are required to upload a profile picture!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Image Picker for Project Logo Upload (Client Detail Left Side Header)
  const pickClientLogo = async (clientId: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera roll permissions are required to upload a project logo!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setClientLogos(prev => ({
        ...prev,
        [clientId]: result.assets[0].uri
      }));
    }
  };

  // Add Document representation into local Vault
  const addClientDocument = async (clientId: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera roll permissions are required to upload project documents!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const fileName = fileUri.split('/').pop() || `document_${Date.now()}.jpg`;
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: fileName.substring(0, 36),
        date: 'TODAY'
      };
      setClientDocs(prev => ({
        ...prev,
        [clientId]: [newDoc, ...(prev[clientId] || [])]
      }));
    }
  };

  // Save new payment milestone record
  const handleSavePayment = (clientId: number) => {
    if (!newMilestoneName.trim() || !newMilestoneAmount.trim()) {
      alert('Please enter both payment description and milestone amount!');
      return;
    }
    const newPayment = {
      id: `pay-${Date.now()}`,
      milestone: newMilestoneName.trim(),
      amount: newMilestoneAmount.trim().startsWith('$') ? newMilestoneAmount.trim() : `$${newMilestoneAmount.trim()}`,
      status: 'PENDING' as const
    };
    setClientPayments(prev => ({
      ...prev,
      [clientId]: [...(prev[clientId] || []), newPayment]
    }));
    setNewMilestoneName('');
    setNewMilestoneAmount('');
    setIsAddingPayment(false);
    setIsShowPayments(true);
  };

  // Toggle milestone payment status
  const togglePaymentStatus = (clientId: number, paymentId: string) => {
    setClientPayments(prev => ({
      ...prev,
      [clientId]: (prev[clientId] || []).map(p => 
        p.id === paymentId ? { ...p, status: p.status === 'PAID' ? 'PENDING' : 'PAID' } : p
      )
    }));
  };

  // Open & Close Verstack Overlay functions
  const openVerstackPage = () => {
    setIsVerstackVisible(true);
    verstackTranslateX.value = withTiming(0, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
  };

  const closeVerstackPage = () => {
    verstackTranslateX.value = withTiming(SCREEN_WIDTH, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setIsVerstackVisible)(false);
      }
    });
  };

  // Open & Close Client Detail Overlay functions
  const openClientDetail = (client: Client) => {
    setSelectedClient(client);
    setIsClientVisible(true);
    setIsShowPayments(false);
    setIsAddingPayment(false);
    clientTranslateX.value = withTiming(0, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
  };

  const closeClientDetail = () => {
    clientTranslateX.value = withTiming(SCREEN_WIDTH, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setIsClientVisible)(false);
        runOnJS(setSelectedClient)(null);
      }
    });
  };

  // Software Engineering state handlers
  const openSWEPage = () => {
    setIsSWEVisible(true);
    sweTranslateX.value = withTiming(0, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
  };

  const closeSWEPage = () => {
    sweTranslateX.value = withTiming(SCREEN_WIDTH, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setIsSWEVisible)(false);
      }
    });
  };

  const openSWEProjectDetail = (proj: SWEProject) => {
    setSelectedSWEProject(proj);
    setIsSWEProjectVisible(true);
    sweProjectTranslateX.value = withTiming(0, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
  };

  const closeSWEProjectDetail = () => {
    sweProjectTranslateX.value = withTiming(SCREEN_WIDTH, {
      duration: 320,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setIsSWEProjectVisible)(false);
        runOnJS(setSelectedSWEProject)(null);
      }
    });
  };

  // Call Client Dialer
  const callClient = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      alert('Dialer linking not supported on this simulator device');
    });
  };

  // Reanimated Animated Styles
  const verstackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: verstackTranslateX.value }]
  }));

  const clientAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: clientTranslateX.value }]
  }));

  const sweAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sweTranslateX.value }]
  }));

  const sweProjectAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sweProjectTranslateX.value }]
  }));

  // PanResponders for gestural swipe-to-back dismissals
  const verstackPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontal && gestureState.dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          verstackTranslateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100 || gestureState.vx > 0.4) {
          verstackTranslateX.value = withTiming(SCREEN_WIDTH, {
            duration: 250,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          }, (finished) => {
            if (finished) {
              runOnJS(setIsVerstackVisible)(false);
            }
          });
        } else {
          verstackTranslateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          });
        }
      }
    })
  ).current;

  const clientPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontal && gestureState.dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          clientTranslateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100 || gestureState.vx > 0.4) {
          clientTranslateX.value = withTiming(SCREEN_WIDTH, {
            duration: 250,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          }, (finished) => {
            if (finished) {
              runOnJS(setIsClientVisible)(false);
              runOnJS(setSelectedClient)(null);
            }
          });
        } else {
          clientTranslateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          });
        }
      }
    })
  ).current;

  const swePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontal && gestureState.dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          sweTranslateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100 || gestureState.vx > 0.4) {
          sweTranslateX.value = withTiming(SCREEN_WIDTH, {
            duration: 250,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          }, (finished) => {
            if (finished) {
              runOnJS(setIsSWEVisible)(false);
            }
          });
        } else {
          sweTranslateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          });
        }
      }
    })
  ).current;

  const sweProjectPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontal && gestureState.dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          sweProjectTranslateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100 || gestureState.vx > 0.4) {
          sweProjectTranslateX.value = withTiming(SCREEN_WIDTH, {
            duration: 250,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          }, (finished) => {
            if (finished) {
              runOnJS(setIsSWEProjectVisible)(false);
              runOnJS(setSelectedSWEProject)(null);
            }
          });
        } else {
          sweProjectTranslateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.bezier(0.25, 1, 0.5, 1)
          });
        }
      }
    })
  ).current;

  const sweProjects: SWEProject[] = [
    {
      id: 101,
      name: 'Synapse AI Core RAG',
      service: 'Asynchronous Vector Intelligence Ingestion',
      status: 'ACTIVE',
      color: theme.ice,
      price: '$54,000.00',
      progress: 88,
      focusTime: '124 Hours',
      repository: 'github.com/harith/synapse-core-rag',
      documentation: [
        'synapse_rag_pipeline_spec_v2.pdf',
        'vector_embedding_db_indexing.md',
        'semantic_router_fallbacks.enc'
      ],
      plan: [
        'Phase 1: Local Knowledge Item Scraper & Parser',
        'Phase 2: High-Dimensional Cosine Similarity Matrix',
        'Phase 3: Dynamic Context Window Compactor',
        'Phase 4: Production LLM Evaluation & Guardrails'
      ],
      checklist: [
        { task: 'Initialize Vector Store (ChromaDB)', completed: true },
        { task: 'Build FastAPI ingestion pipeline', completed: true },
        { task: 'Design semantic context compaction router', completed: true },
        { task: 'Implement local Ollama fallback logic', completed: false },
        { task: 'Final stress test on multi-threaded queries', completed: false }
      ],
      commits: [
        { hash: 'b8a2e10', msg: 'feat(rag): optimized vector similarity calculations by 34%', time: '2 hrs ago', author: 'Harith' },
        { hash: 'f2c99a4', msg: 'refactor(api): migrated embedding layer to asynchronous workers', time: 'Yesterday', author: 'Harith' },
        { hash: 'd5e1a90', msg: 'docs(rag): updated semantic chunking strategies inside configuration', time: '2 days ago', author: 'Harith' },
        { hash: 'c9e8d12', msg: 'fix(db): resolved database lock inside high-concurrency ingestion', time: '3 days ago', author: 'Harith' },
        { hash: 'a1f2e30', msg: 'test(core): added robust unit tests for context router fallback', time: '5 days ago', author: 'Harith' }
      ],
      marketingMetric: 'CONV: +28.5%'
    },
    {
      id: 102,
      name: 'Core OS Memory Engine',
      service: 'Asynchronous JSI Thread Schedulers',
      status: 'COMPLETED',
      color: '#10b981',
      price: '$42,000.00',
      progress: 100,
      focusTime: '280 Hours',
      repository: 'github.com/harith/core-os-memory-engine',
      documentation: [
        'low_latency_bridge_spec.pdf',
        'concurrency_garbage_collection.md'
      ],
      plan: [
        'Phase 1: Bridge Serialization Protocol Design',
        'Phase 2: C++ Native Modules Binding layer',
        'Phase 3: Rust Thread-pool Executor binds',
        'Phase 4: Dynamic Garbage Compactor tests'
      ],
      checklist: [
        { task: 'Set up JSI (JavaScript Interface) bindings', completed: true },
        { task: 'Compile Rust native libraries for arm64', completed: true },
        { task: 'Implement dynamic memory pooling', completed: true },
        { task: 'Run strict stress tests against frame drops', completed: true },
        { task: 'Deploy official stable release', completed: true }
      ],
      commits: [
        { hash: 'c2a9d88', msg: 'release(v1.0.0): deployed stable memory engine libraries', time: '1 week ago', author: 'Harith' },
        { hash: 'f5b8a11', msg: 'feat(rust): integrated async execution pools inside arm64 binaries', time: '1 week ago', author: 'Harith' },
        { hash: 'e4c2910', msg: 'fix(memory): resolved native leaks inside JSI bridging callbacks', time: '2 weeks ago', author: 'Harith' },
        { hash: 'd2a9c88', msg: 'refactor(core): optimized garbage compactor sweep triggers', time: '2 weeks ago', author: 'Harith' },
        { hash: 'a5b8a19', msg: 'docs(binding): documented native Bindings setup procedures', time: '3 weeks ago', author: 'Harith' }
      ],
      marketingMetric: 'LOAD TIME: -65.2%'
    },
    {
      id: 103,
      name: 'Decentralized Oracle Grid',
      service: 'Securing Decentralized Data consensus',
      status: 'ACTIVE',
      color: '#eab308',
      price: '$38,500.00',
      progress: 72,
      focusTime: '154 Hours',
      repository: 'github.com/harith/decentralized-oracle-grid',
      documentation: [
        'decentralized_oracle_consensus_v1.pdf',
        'smart_contract_validation.sol'
      ],
      plan: [
        'Phase 1: Multi-signature Consensus formulation',
        'Phase 2: Solidity validation smart contracts',
        'Phase 3: Go network peer-to-peer telemetry',
        'Phase 4: Production testnet dry-runs'
      ],
      checklist: [
        { task: 'Implement multisig smart contracts', completed: true },
        { task: 'Design peer discovery protocol in Go', completed: true },
        { task: 'Setup decentralized validation telemetry', completed: false },
        { task: 'Complete dry-runs on Ethereum testnet', completed: false }
      ],
      commits: [
        { hash: 'f9c8d11', msg: 'feat(consensus): optimized validator threshold voting signature matching', time: '4 days ago', author: 'Harith' },
        { hash: 'e2a9b34', msg: 'refactor(p2p): improved peer routing speed inside Go daemon', time: '1 week ago', author: 'Harith' },
        { hash: 'd1a9b22', msg: 'fix(sol): resolved potential reentrancy warning inside oracle parser', time: '1 week ago', author: 'Harith' },
        { hash: 'c3a9d88', msg: 'feat(telemetry): added automated consensus state logs exporter', time: '2 weeks ago', author: 'Harith' },
        { hash: 'a2b8e10', msg: 'docs(oracle): documented node setup requirements for testnet', time: '2 weeks ago', author: 'Harith' }
      ],
      marketingMetric: 'GAS COST: -18.4%'
    },
    {
      id: 104,
      name: 'Enterprise Web Matrix',
      service: 'Microservices Separation & Edge Caching',
      status: 'COMPLETED',
      color: '#a855f7',
      price: '$29,000.00',
      progress: 100,
      focusTime: '190 Hours',
      repository: 'github.com/harith/enterprise-web-matrix',
      documentation: [
        'enterprise_security_architecture.pdf',
        'database_sharding_strategy.md'
      ],
      plan: [
        'Phase 1: Secure session database setups',
        'Phase 2: Go microservices separation',
        'Phase 3: Next.js frontend composition',
        'Phase 4: Production deployment and DNS caching'
      ],
      checklist: [
        { task: 'Implement Next.js secure middleware routing', completed: true },
        { task: 'Build Go authentication services', completed: true },
        { task: 'Implement database sharding strategies', completed: true },
        { task: 'Configure CDN edge caching layers', completed: true },
        { task: 'Deploy live distribution packages', completed: true }
      ],
      commits: [
        { hash: 'd9c8d11', msg: 'release(v2.0.0): deployed stable high-performance Next.js system', time: '3 weeks ago', author: 'Harith' },
        { hash: 'c2a9b33', msg: 'feat(cdn): optimized edge caching strategies for high load', time: '3 weeks ago', author: 'Harith' },
        { hash: 'b1a2099', msg: 'fix(db): resolved database deadlock under connection pools stress', time: '1 month ago', author: 'Harith' },
        { hash: 'a5e1a90', msg: 'refactor(micro): converted session validation into standalone daemon', time: '1 month ago', author: 'Harith' },
        { hash: 'a1f2e10', msg: 'docs(readme): updated complete microservices architecture diagram', time: '1 month ago', author: 'Harith' }
      ],
      marketingMetric: 'SEO SCORE: 100/100'
    }
  ];

  const skills: Skill[] = [
    {
      id: 1,
      name: 'Verstack.Lk (my first startup)',
      level: 'FOUNDER & ARCHITECT',
      progress: 92,
      lastWorked: 'MAY 17, 2026',
      focusTime: '3.5 Years (1,280 Days)',
      tags: ['SaaS Scale', 'Enterprise Operations', 'Client Dev'],
      color: '#eab308', 
      bio: 'Full-stack engineering, infrastructure planning, and executive business scaling for the premier web-solution ecosystem.',
      icon: <Cpu size={18} color="#eab308" />
    },
    {
      id: 2,
      name: 'Software Engineering',
      level: 'PRINCIPAL SYSTEMS ARCHITECT',
      progress: 98,
      lastWorked: 'TODAY (04:32 PM)',
      focusTime: '5.2 Years (4,800 Hours)',
      tags: ['React Native', 'Next.js', 'Go / Node', 'Architectures'],
      color: theme.ice, 
      bio: 'Designing robust, high-performance distributed systems with focus on asynchronous UI concurrency and minimal memory load.',
      icon: <Code size={18} color={theme.ice} />
    },
    {
      id: 3,
      name: 'Trading',
      level: 'QUANTITATIVE PROP TRADER',
      progress: 88,
      lastWorked: 'TODAY (11:15 AM)',
      focusTime: '2.5 Years (840 Days)',
      tags: ['ICT / SMC Principles', 'DeFi / Web3', 'Liquidity Analysis'],
      color: '#10b981', 
      bio: 'Executing trade setups based on institutional liquidity pools, orderblocks, and risk mitigation protocols across premium digital assets.',
      icon: <Zap size={18} color="#10b981" />
    },
    {
      id: 4,
      name: 'Cyber Security Engineering',
      level: 'OFFENSIVE SECURITY LEAD',
      progress: 76,
      lastWorked: 'MAY 15, 2026',
      focusTime: '1.8 Years (450 Days)',
      tags: ['Penetration Auditing', 'OWASP Top 10', 'Smart Contracts'],
      color: '#ef4444', 
      bio: 'Conducting system intrusion simulations, logic audit assessments, and fortifying enterprise network security postures.',
      icon: <Shield size={18} color="#ef4444" />
    },
    {
      id: 5,
      name: 'Content Creating',
      level: 'EXECUTIVE BRAND DIRECTOR',
      progress: 80,
      lastWorked: 'MAY 16, 2026',
      focusTime: '2.0 Years (240 Days)',
      tags: ['Digital Distribution', 'Developer Advocacy', 'Systems SEO'],
      color: '#a855f7', 
      bio: 'Formulating high-value developer assets, sharing software architecture walkthroughs, and scaling technical branding matrices.',
      icon: <Sparkles size={18} color="#a855f7" />
    }
  ];

  return (
    <View style={styles.container}>
      <CEOBackground />
      <ScreenHeader title="Skills" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* EXECUTIVE CAPABILITY STATEMENT */}
        <GlassCard style={styles.headerCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Award color={theme.ice} size={24} />
            <Text style={[styles.headerCardTitle, { color: theme.text }]}>CAPABILITY MATRIX</Text>
          </View>
          <Text style={[styles.headerCardBio, { color: theme.text2 }]}>
            High-performance development center monitoring active capability sectors, total time investments, and operational mastery.
          </Text>
        </GlassCard>

        {/* SKILLS CARDS LIST */}
        <View style={{ gap: 16 }}>
          {skills.map((skill) => (
            <TouchableOpacity 
              key={skill.id} 
              activeOpacity={0.8}
              onPress={
                skill.id === 1 ? openVerstackPage :
                skill.id === 2 ? openSWEPage :
                undefined
              }
            >
              <GlassCard style={[styles.skillCard, { borderColor: skill.color + '30' }]}>
                
                {/* Card Header Title and Level */}
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <View style={[styles.iconBox, { backgroundColor: skill.color + '12', borderColor: skill.color + '40' }]}>
                      {skill.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.skillName, { color: theme.text }]} numberOfLines={1}>
                          {skill.name}
                        </Text>
                        {(skill.id === 1 || skill.id === 2) && <ArrowUpRight size={14} color={skill.color} />}
                      </View>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8.5, color: theme.text2, letterSpacing: 0.5, marginTop: 2 }}>
                        {skill.level}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Mastery Percentage Badge */}
                  <View style={[styles.percentageBadge, { borderColor: skill.color + '40' }]}>
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10, color: skill.color }}>
                      {skill.progress}%
                    </Text>
                  </View>
                </View>

                {/* Bio description */}
                <Text style={[styles.skillBio, { color: theme.text2 }]}>{skill.bio}</Text>

                {/* Dynamic Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBarTrack, { backgroundColor: theme.border + '20' }]}>
                    <View style={[styles.progressBarFill, { width: `${skill.progress}%`, backgroundColor: skill.color }]} />
                  </View>
                </View>

                {/* Technology / Focus Tags */}
                <View style={styles.tagsContainer}>
                  {skill.tags.map((tag, idx) => (
                    <View key={idx} style={[styles.tagBadge, { borderColor: theme.border + '30' }]}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7.5, color: theme.text2 }}>
                        {tag.toUpperCase()}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Card Footer: Last worked date and focus duration */}
                <View style={[styles.cardFooter, { borderTopColor: 'rgba(255, 255, 255, 0.04)' }]}>
                  <View style={styles.footerItem}>
                    <Text style={[styles.footerLabel, { color: theme.text2 }]}>LAST FOCUS</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Activity size={10} color={skill.color} />
                      <Text style={[styles.footerVal, { color: theme.text }]}>{skill.lastWorked}</Text>
                    </View>
                  </View>

                  <View style={[styles.footerItem, { alignItems: 'flex-end' }]}>
                    <Text style={[styles.footerLabel, { color: theme.text2 }]}>TIME COMMITTED</Text>
                    <Text style={[styles.footerVal, { color: theme.text, marginTop: 4 }]}>
                      {skill.focusTime}
                    </Text>
                  </View>
                </View>

              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ========================================== */}
      {/* VERSTACK.LK BRAND NEW SCREEN OVERLAY       */}
      {/* ========================================== */}
      {isVerstackVisible && (
        <Animated.View 
          style={[styles.detailOverlay, verstackAnimatedStyle, { backgroundColor: theme.bg }]}
          {...verstackPanResponder.panHandlers}
        >
          <CEOBackground />
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={closeVerstackPage} style={[styles.backBtn, { borderColor: theme.border }]}>
              <Text style={{ color: '#eab308', fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11 }}>◀ BACK</Text>
            </TouchableOpacity>
            <Text style={[styles.overlayTitle, { color: theme.text }]}>VERSTACK HUB</Text>
            <View style={{ width: 68 }} />
          </View>

          <ScrollView contentContainerStyle={styles.overlayScroll} showsVerticalScrollIndicator={false}>
            
            {/* TOP PROFILE AND UPLOADER AREA */}
            <View style={styles.topProfileRow}>
              {/* Square Profile Picture Upload Button */}
              <TouchableOpacity activeOpacity={0.8} onPress={pickImage} style={[styles.squareAvatar, { borderColor: '#eab308' + '60' }]}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Cpu size={32} color="#eab308" />
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: theme.text2, marginTop: 4 }}>UPLOAD</Text>
                  </View>
                )}
                <View style={styles.avatarUploadIcon}>
                  <Plus size={12} color="#000" />
                </View>
              </TouchableOpacity>
              
              {/* Name & Slogan on the right side of the row */}
              <View style={styles.logoTextCol}>
                <Text style={styles.logoText}>VERSTACK.LK</Text>
                <Text style={[styles.sloganText, { color: theme.text2 }]}>
                  "Decentralized Digital Solutions. Engineered for Absolute Scale."
                </Text>
              </View>
            </View>

            {/* Social Media Icons row below the header row */}
            <View style={styles.socialContainer}>
              <View style={styles.socialRow}>
                <TouchableOpacity style={[styles.socialIconBtn, { borderColor: theme.border + '30' }]}>
                  <Globe size={18} color="#eab308" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIconBtn, { borderColor: theme.border + '30' }]}>
                  <FolderGit size={18} color="#eab308" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIconBtn, { borderColor: theme.border + '30' }]}>
                  <MessageSquare size={18} color="#1da1f2" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIconBtn, { borderColor: theme.border + '30' }]}>
                  <Award size={18} color="#0a66c2" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIconBtn, { borderColor: theme.border + '30' }]}>
                  <Send size={18} color="#0088cc" />
                </TouchableOpacity>
              </View>
            </View>

            {/* MARKETING HUB ACTION BUTTON */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.marketingBtn, { borderColor: '#eab308' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} color="#eab308" />
                <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: '#eab308', letterSpacing: 1.5 }}>
                  MARKETING ENGINE HUB
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: theme.text2 }}>CONV: +22.4%</Text>
                <ExternalLink size={12} color="#eab308" />
              </View>
            </TouchableOpacity>
            {/* STARTUP CONTRACT FINANCIALS LEDGER SUMMARY */}
            {(() => {
              const totalNetRevenue = clients.reduce((acc, client) => {
                const num = parseFloat(client.price.replace(/[^0-9.]/g, ''));
                return acc + (isNaN(num) ? 0 : num);
              }, 0);
              const totalPaid = Object.values(clientPayments).flat().reduce((acc, pay) => {
                if (pay.status !== 'PAID') return acc;
                const num = parseFloat(pay.amount.replace(/[^0-9.]/g, ''));
                return acc + (isNaN(num) ? 0 : num);
              }, 0);
              const totalPending = Object.values(clientPayments).flat().reduce((acc, pay) => {
                if (pay.status !== 'PENDING') return acc;
                const num = parseFloat(pay.amount.replace(/[^0-9.]/g, ''));
                return acc + (isNaN(num) ? 0 : num);
              }, 0);

              const formattedNet = `$${totalNetRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
              const formattedPaid = `$${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
              const formattedPending = `$${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

              return (
                <GlassCard style={{ padding: 16, marginBottom: 20, borderColor: '#eab308' + '30' }}>
                  <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: '#eab308', letterSpacing: 1.5, marginBottom: 12 }}>
                    VERSTACK FINANCIAL LEDGER SUMMARY
                  </Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 7.5, color: theme.text2, letterSpacing: 0.5 }}>NET VALUE</Text>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 14.5, color: theme.text, marginTop: 4 }}>
                        {formattedNet}
                      </Text>
                    </View>

                    <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.05)', paddingLeft: 8 }}>
                      <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 7.5, color: '#10b981', letterSpacing: 0.5 }}>TOTAL PAID</Text>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 14.5, color: '#10b981', marginTop: 4 }}>
                        {formattedPaid}
                      </Text>
                    </View>

                    <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.05)', paddingLeft: 8 }}>
                      <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 7.5, color: '#eab308', letterSpacing: 0.5 }}>PENDING OUT</Text>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 14.5, color: '#eab308', marginTop: 4 }}>
                        {formattedPending}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })()}
            {/* STATE TASK COUNT INDICATORS (COMPLETE, PENDING, IN PROCESS, CANCELED) */}
            <View style={styles.stateCountsContainer}>
              <TouchableOpacity style={[styles.countBtn, { borderColor: '#10b981' + '40', backgroundColor: 'rgba(16, 185, 129, 0.03)' }]}>
                <Text style={[styles.countNum, { color: '#10b981' }]}>{taskCounts.complete}</Text>
                <Text style={[styles.countLabel, { color: theme.text2 }]}>COMPLETE</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.countBtn, { borderColor: '#eab308' + '40', backgroundColor: 'rgba(234, 179, 8, 0.03)' }]}>
                <Text style={[styles.countNum, { color: '#eab308' }]}>{taskCounts.pending}</Text>
                <Text style={[styles.countLabel, { color: theme.text2 }]}>PENDING</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.countBtn, { borderColor: theme.ice + '40', backgroundColor: 'rgba(6, 182, 212, 0.03)' }]}>
                <Text style={[styles.countNum, { color: theme.ice }]}>{taskCounts.inProcess}</Text>
                <Text style={[styles.countLabel, { color: theme.text2 }]}>IN PROCESS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.countBtn, { borderColor: '#ef4444' + '40', backgroundColor: 'rgba(239, 68, 68, 0.03)' }]}>
                <Text style={[styles.countNum, { color: '#ef4444' }]}>{taskCounts.canceled}</Text>
                <Text style={[styles.countLabel, { color: theme.text2 }]}>CANCELED</Text>
              </TouchableOpacity>
            </View>

            {/* CLIENTS LIST */}
            <Text style={[styles.sectionTitle, { color: theme.text2, marginTop: 12 }]}>VERSTACK ACTIVE CLIENTS</Text>
            <View style={{ gap: 10, marginBottom: 20 }}>
              {clients.map(client => (
                <TouchableOpacity 
                  key={client.id} 
                  activeOpacity={0.8}
                  onPress={() => openClientDetail(client)}
                >
                  <GlassCard style={[styles.clientCard, { borderColor: client.color + '25', padding: 12 }]}>
                    
                    {/* Top Row with Logo, Name, Service and Status Badge */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      {/* Uploaded client logo or default fallback */}
                      <View style={[styles.clientCardLogo, { borderColor: client.color + '40', backgroundColor: client.color + '08' }]}>
                        {clientLogos[client.id] ? (
                          <Image source={{ uri: clientLogos[client.id] }} style={styles.clientCardLogoImage} />
                        ) : (
                          <FolderGit size={16} color={client.color} />
                        )}
                      </View>

                      {/* Text details */}
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.clientName, { color: theme.text, fontSize: 12.5 }]} numberOfLines={1}>{client.name}</Text>
                          <ArrowUpRight size={12} color={client.color} />
                        </View>
                        <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 9.5, color: theme.text2, marginTop: 2 }} numberOfLines={1}>
                          {client.service}
                        </Text>
                      </View>

                      {/* Status badge */}
                      <View style={[styles.clientStatusBadge, { borderColor: client.color + '50' }]}>
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7.5, color: client.color }}>
                          {client.status}
                        </Text>
                      </View>
                    </View>

                    {/* Mid row with Progress Tracker */}
                    <View style={{ marginTop: 10 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 7.5, color: theme.text2, letterSpacing: 0.5 }}>TRACK PROGRESS</Text>
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: client.color }}>{client.progress}%</Text>
                      </View>
                      <View style={[styles.progressBarTrack, { height: 3.5, backgroundColor: theme.border + '15', marginBottom: 0 }]}>
                        <View style={[styles.progressBarFill, { width: `${client.progress}%`, backgroundColor: client.color }]} />
                      </View>
                    </View>

                    {/* Bottom row with Latest Commit logs */}
                    {client.commits && client.commits.length > 0 && (
                      <View style={[styles.latestCommitBox, { borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.04)', marginTop: 10, paddingTop: 8 }]}>
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7, color: theme.text2, letterSpacing: 0.5, marginBottom: 3 }}>
                          LATEST REPOSITORY COMMIT
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                          <Terminal size={10} color={client.color} />
                          <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 9, color: theme.text, flex: 1 }} numberOfLines={1}>
                            {client.commits[0].msg}
                          </Text>
                          <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: theme.text2 }}>
                            [{client.commits[0].hash}]
                          </Text>
                        </View>
                      </View>
                    )}

                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>

            {/* TASK HISTORY LOGS (Yatinma / At the bottom) */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>OPERATIONAL TASK HISTORY</Text>
            <GlassCard style={{ padding: 16 }}>
              {taskHistory.map((item, idx) => (
                <View 
                  key={item.id} 
                  style={[
                    styles.historyRow, 
                    idx !== taskHistory.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={[styles.historyTaskText, { color: theme.text }]}>{item.task}</Text>
                      <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 8.5, color: theme.text2, marginTop: 4 }}>
                        Logged: {item.date}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 13, color: theme.text }}>
                      {item.time}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <CheckCircle2 color="#10b981" size={10} />
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8.5, color: '#10b981' }}>{item.status}</Text>
                    </View>
                    <View style={[styles.categoryBadge, { borderColor: theme.border + '30' }]}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: theme.text2 }}>DEV_LOG</Text>
                    </View>
                  </View>
                </View>
              ))}
            </GlassCard>

          </ScrollView>
        </Animated.View>
      )}

      {/* ========================================== */}
      {/* BRAND NEW CLIENT DETAIL SCREEN OVERLAY     */}
      {/* ========================================== */}
      {isClientVisible && selectedClient && (
        <Animated.View 
          style={[styles.detailOverlay, clientAnimatedStyle, { backgroundColor: theme.bg }]}
          {...clientPanResponder.panHandlers}
        >
          <CEOBackground />
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={closeClientDetail} style={[styles.backBtn, { borderColor: theme.border }]}>
              <Text style={{ color: selectedClient.color, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11 }}>◀ BACK</Text>
            </TouchableOpacity>
            <Text style={[styles.overlayTitle, { color: theme.text }]}>CLIENT FILE</Text>
            <TouchableOpacity 
              onPress={() => callClient(selectedClient.phone)} 
              style={[styles.callHeaderBtn, { borderColor: selectedClient.color + '50' }]}
            >
              <PhoneCall size={14} color={selectedClient.color} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.overlayScroll} showsVerticalScrollIndicator={false}>
            
            {/* CLIENT PROFILE HEADER CARD WITH DYNAMIC LOGO UPLOADER ON LEFT SIDE */}
            <GlassCard style={[styles.clientDetailHeaderCard, { borderColor: selectedClient.color + '30' }]}>
              <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                <TouchableOpacity 
                  activeOpacity={0.8} 
                  onPress={() => pickClientLogo(selectedClient.id)} 
                  style={[styles.clientLogoUploader, { borderColor: selectedClient.color + '60' }]}
                >
                  {clientLogos[selectedClient.id] ? (
                    <Image source={{ uri: clientLogos[selectedClient.id] }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <FolderGit size={22} color={selectedClient.color} />
                    </View>
                  )}
                  <View style={styles.clientLogoUploadIcon}>
                    <Plus size={8} color="#000" />
                  </View>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.clientDetailName, { color: theme.text }]}>{selectedClient.name}</Text>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8.5, color: theme.text2, letterSpacing: 0.5, marginTop: 2 }}>
                    {selectedClient.service.toUpperCase()}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* PROJECT SPECIFICATION SHEET - BODY TEXT ENLARGED (14.5px) */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>PROJECT METADATA</Text>
            <GlassCard style={{ padding: 18 }}>
              <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 15.5, color: theme.text, marginBottom: 8 }}>
                {selectedClient.projectTitle}
              </Text>
              <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 14.5, color: theme.text2, lineHeight: 21, marginBottom: 16 }}>
                {selectedClient.projectDesc}
              </Text>

              {/* Stacks / Tags */}
              <View style={styles.tagsContainer}>
                <View style={[styles.tagBadge, { borderColor: theme.border + '30' }]}>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7.5, color: theme.text2 }}>REACT NATIVE</Text>
                </View>
                <View style={[styles.tagBadge, { borderColor: theme.border + '30' }]}>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7.5, color: theme.text2 }}>TYPESCRIPT</Text>
                </View>
                <View style={[styles.tagBadge, { borderColor: theme.border + '30' }]}>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7.5, color: theme.text2 }}>MIDDLEWARE API</Text>
                </View>
              </View>
            </GlassCard>

            {/* DYNAMIC CONTRACT VALUE & PAYMENT LEDGER */}
            <Text style={[styles.sectionTitle, { color: theme.text2, marginTop: 12 }]}>FINANCIAL CONTRACT & LEDGER</Text>
            <GlassCard style={{ padding: 16, borderColor: selectedClient.color + '20' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: theme.text2, letterSpacing: 0.5 }}>CONTRACT VALUE</Text>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 22, color: theme.text, marginTop: 4 }}>
                    {selectedClient.price}
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => setIsShowPayments(prev => !prev)}
                    style={[styles.smallActionBtn, { borderColor: selectedClient.color + '60' }]}
                  >
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10.5, color: selectedClient.color }}>
                      {isShowPayments ? 'HIDE LEDGER' : 'VIEW LEDGER'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => setIsAddingPayment(prev => !prev)}
                    style={[styles.smallActionBtn, { borderColor: '#10b981' + '60', backgroundColor: 'rgba(16, 185, 129, 0.05)' }]}
                  >
                    <Plus size={11} color="#10b981" />
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10.5, color: '#10b981', marginLeft: 2 }}>
                      ADD RECORD
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* INLINE ADD PAYMENT FORM */}
              {isAddingPayment && (
                <View style={[styles.inlineForm, { borderTopColor: 'rgba(255, 255, 255, 0.05)', borderTopWidth: 1, marginTop: 12, paddingTop: 12 }]}>
                  <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10.5, color: theme.text2, marginBottom: 6 }}>RECORD NEW PAYMENT RECORD</Text>
                  <View style={{ gap: 8 }}>
                    <TextInput
                      style={[styles.textInput, { borderColor: theme.border + '40', color: theme.text }]}
                      placeholder="Milestone (e.g. Frontend Signoff)"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      value={newMilestoneName}
                      onChangeText={setNewMilestoneName}
                    />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        style={[styles.textInput, { flex: 1, borderColor: theme.border + '40', color: theme.text }]}
                        placeholder="Amount (e.g. $5,000)"
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        value={newMilestoneAmount}
                        onChangeText={setNewMilestoneAmount}
                      />
                      <TouchableOpacity 
                        activeOpacity={0.8}
                        onPress={() => handleSavePayment(selectedClient.id)}
                        style={[styles.saveFormBtn, { backgroundColor: '#10b981' }]}
                      >
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10.5, color: '#000' }}>SAVE</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* PAYMENT RECORDS LIST */}
              {isShowPayments && (
                <View style={{ borderTopColor: 'rgba(255, 255, 255, 0.05)', borderTopWidth: 1, marginTop: 12, paddingTop: 10 }}>
                  {(!clientPayments[selectedClient.id] || clientPayments[selectedClient.id].length === 0) ? (
                    <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 12, color: theme.text2, textAlign: 'center', paddingVertical: 10 }}>
                      No payment records recorded yet.
                    </Text>
                  ) : (
                    clientPayments[selectedClient.id].map((payment, idx) => (
                      <View 
                        key={payment.id} 
                        style={[
                          styles.paymentRow, 
                          idx !== clientPayments[selectedClient.id].length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                        ]}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 13.5, color: theme.text }}>
                              {payment.milestone}
                            </Text>
                            <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 13, color: selectedClient.color, marginTop: 2 }}>
                              {payment.amount}
                            </Text>
                          </View>
                          
                          {/* Toggle status */}
                          <TouchableOpacity 
                            activeOpacity={0.8}
                            onPress={() => togglePaymentStatus(selectedClient.id, payment.id)}
                            style={[
                              styles.statusToggleBadge, 
                              { 
                                borderColor: payment.status === 'PAID' ? '#10b981' + '60' : '#eab308' + '60',
                                backgroundColor: payment.status === 'PAID' ? 'rgba(16, 185, 129, 0.03)' : 'rgba(234, 179, 8, 0.03)'
                              }
                            ]}
                          >
                            <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10, color: payment.status === 'PAID' ? '#10b981' : '#eab308' }}>
                              {payment.status}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}
            </GlassCard>

            {/* VISUAL PROJECT PROGRESS & DYNAMIC FOCUS TIME */}
            <Text style={[styles.sectionTitle, { color: theme.text2, marginTop: 12 }]}>DEVELOPMENT MATRIX COMPLETION</Text>
            <GlassCard style={{ padding: 16, borderColor: selectedClient.color + '20' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10.5, color: theme.text, letterSpacing: 0.5 }}>
                  TOTAL TRACK PROGRESS
                </Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 14, color: selectedClient.color }}>
                  {selectedClient.progress}%
                </Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={[styles.progressBarTrack, { backgroundColor: theme.border + '20' }]}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${selectedClient.progress}%`, backgroundColor: selectedClient.color }
                    ]} 
                  />
                </View>
              </View>

              {/* Dedicated Focus Time Row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 }}>
                <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: theme.text2 }}>
                  DEDICATED FOCUS TIME
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Clock size={12} color={selectedClient.color} />
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 12, color: theme.text }}>
                    {selectedClient.focusTime}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* INTERACTIVE SECURE PROJECT DOCUMENTS SECTION */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 12 }}>
              <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: theme.text2, letterSpacing: 1.5 }}>
                SECURE DOCUMENT SECRETS
              </Text>
              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => addClientDocument(selectedClient.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Plus size={12} color={selectedClient.color} />
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: selectedClient.color }}>ADD DOC</Text>
              </TouchableOpacity>
            </View>

            <GlassCard style={{ padding: 16 }}>
              {(!clientDocs[selectedClient.id] || clientDocs[selectedClient.id].length === 0) ? (
                <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 11, color: theme.text2, textAlign: 'center', paddingVertical: 10 }}>
                  No documents secure uploaded yet.
                </Text>
              ) : (
                clientDocs[selectedClient.id].map((doc, idx) => (
                  <View 
                    key={doc.id} 
                    style={[
                      styles.historyRow, 
                      { paddingVertical: 10 },
                      idx !== clientDocs[selectedClient.id].length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                    ]}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 12 }}>
                        <ListTodo size={14} color={selectedClient.color} />
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11, color: theme.text }} numberOfLines={1}>
                          {doc.name}
                        </Text>
                      </View>
                      <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 8.5, color: theme.text2 }}>
                        {doc.date}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </GlassCard>

            {/* ROADMAP / PLAN BUTTON */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.planBtn, { borderColor: selectedClient.color }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Map size={14} color={selectedClient.color} />
                <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: selectedClient.color, letterSpacing: 1.5 }}>
                  LAUNCH PROJECT ROADMAP PLAN
                </Text>
              </View>
              <ArrowUpRight size={14} color={selectedClient.color} />
            </TouchableOpacity>

            {/* GITHUB PROJECT FOLDER TERMINAL CARD */}
            <Text style={[styles.sectionTitle, { color: theme.text2, marginTop: 12 }]}>GITHUB SYSTEM REPOSITORY</Text>
            <GlassCard style={styles.terminalRepoCard}>
              <View style={styles.terminalHeader}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <View style={[styles.termDot, { backgroundColor: '#ef4444' }]} />
                  <View style={[styles.termDot, { backgroundColor: '#eab308' }]} />
                  <View style={[styles.termDot, { backgroundColor: '#10b981' }]} />
                </View>
                <View style={[styles.branchBadge, { borderColor: selectedClient.color + '50', paddingHorizontal: 8, paddingVertical: 2.5 }]}>
                  <GitBranch size={11} color={selectedClient.color} style={{ marginRight: 4 }} />
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10.5, color: selectedClient.color }}>MAIN</Text>
                </View>
              </View>

              <View style={styles.terminalBody}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Terminal size={16} color={theme.text2} />
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 14.5, color: theme.text }}>
                    {selectedClient.repository}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* GITHUB COMMIT HISTORY LOGS */}
            <Text style={[styles.sectionTitle, { color: theme.text2, marginTop: 12 }]}>SYSTEMS COMMIT HISTORY</Text>
            <GlassCard style={{ padding: 16 }}>
              {selectedClient.commits.map((commit, idx) => (
                <View 
                  key={commit.hash} 
                  style={[
                    styles.historyRow, 
                    idx !== selectedClient.commits.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={[styles.commitMsgText, { color: theme.text }]}>{commit.msg}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 6 }}>
                        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 11, color: theme.text2 }}>
                          Authored by: {commit.author}
                        </Text>
                        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 11, color: theme.text2 }}>•</Text>
                        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 11, color: selectedClient.color }}>
                          {commit.time}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.hashBadge, { borderColor: theme.border + '30', paddingHorizontal: 8, paddingVertical: 3.5 }]}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11, color: theme.text }}>
                        {commit.hash}
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
      {/* SOFTWARE ENGINEERING SCREEN OVERLAY        */}
      {/* ========================================== */}
      {isSWEVisible && (
        <Animated.View 
          style={[styles.detailOverlay, sweAnimatedStyle, { backgroundColor: theme.bg }]}
          {...swePanResponder.panHandlers}
        >
          <CEOBackground />
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={closeSWEPage} style={[styles.backBtn, { borderColor: theme.border }]}>
              <Text style={{ color: theme.ice, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11 }}>◀ BACK</Text>
            </TouchableOpacity>
            <Text style={[styles.overlayTitle, { color: theme.text }]}>ENGINEERING WORKSPACE</Text>
            <View style={{ width: 68 }} />
          </View>

          <ScrollView contentContainerStyle={styles.overlayScroll} showsVerticalScrollIndicator={false}>
            
            {/* TOTAL EARNED CARD */}
            <GlassCard style={{ padding: 18, marginBottom: 20, alignItems: 'center', borderColor: theme.ice + '40' }}>
              <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: theme.text2, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
                CUMULATIVE CONTRACT VALUE
              </Text>
              <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 32, color: theme.ice }}>
                $163,500.00
              </Text>
              <View style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', width: '100%', marginVertical: 12 }} />
              
              {/* SOCIAL / PLATFORM ICONS (LinkedIn, GitHub, Portfolio) */}
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <TouchableOpacity style={[styles.socialIconBtn, { borderColor: theme.border + '30', width: 42, height: 42, borderRadius: 8 }]} onPress={() => Linking.openURL('https://linkedin.com')}>
                  <Award size={20} color="#0a66c2" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIconBtn, { borderColor: theme.border + '30', width: 42, height: 42, borderRadius: 8 }]} onPress={() => Linking.openURL('https://github.com')}>
                  <FolderGit size={20} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIconBtn, { borderColor: theme.border + '30', width: 42, height: 42, borderRadius: 8 }]} onPress={() => Linking.openURL('https://verstack.lk')}>
                  <Globe size={20} color="#eab308" />
                </TouchableOpacity>
              </View>
            </GlassCard>

            {/* INTERN CARD (mage intern card eka..) */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>PROFESSIONAL FOUNDATIONS</Text>
            <GlassCard style={{ padding: 16, marginBottom: 22, borderColor: '#10b981' + '30' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 14.5, color: theme.text }}>
                    Software Systems Engineering Intern
                  </Text>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9.5, color: '#10b981', marginTop: 3 }}>
                    VERSTACK SYSTEMS LAB
                  </Text>
                </View>
                <View style={{ borderWidth: 1, borderColor: '#10b981' + '60', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: '#10b981' }}>VERIFIED LOG</Text>
                </View>
              </View>
              <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 11, color: theme.text2, lineHeight: 16, marginBottom: 12 }}>
                Designed asynchronous thread pool handlers, high-throughput WebAssembly AST parses, and premium low-latency JSI modules matching state-of-the-art React Native architectures.
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)', paddingTop: 10 }}>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8.5, color: theme.text2 }}>DURATION: 6 MONTHS</Text>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8.5, color: theme.text2 }}>JAN 2026 - JUN 2026</Text>
              </View>
            </GlassCard>

            {/* SOFTWARE ENGINEERING PROJECTS LIST */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>ACTIVE SYSTEMS REPOSITORIES</Text>
            <View style={{ gap: 12, marginBottom: 20 }}>
              {sweProjects.map(proj => (
                <TouchableOpacity 
                  key={proj.id} 
                  activeOpacity={0.8}
                  onPress={() => openSWEProjectDetail(proj)}
                >
                  <GlassCard style={[styles.clientCard, { borderColor: proj.color + '25', padding: 14 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={[styles.clientCardLogo, { borderColor: proj.color + '40', backgroundColor: proj.color + '08' }]}>
                        <Code size={16} color={proj.color} />
                      </View>
                      
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.clientName, { color: theme.text, fontSize: 13 }]} numberOfLines={1}>
                            {proj.name}
                          </Text>
                          <ArrowUpRight size={12} color={proj.color} />
                        </View>
                        <Text style={{ fontFamily: 'Syne_400Regular', fontSize: 9.5, color: theme.text2, marginTop: 2 }} numberOfLines={1}>
                          {proj.service}
                        </Text>
                      </View>

                      <View style={[styles.clientStatusBadge, { borderColor: proj.color + '50' }]}>
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7.5, color: proj.color }}>
                          {proj.status}
                        </Text>
                      </View>
                    </View>

                    {/* Mid row with Progress Tracker */}
                    <View style={{ marginTop: 12 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 7.5, color: theme.text2, letterSpacing: 0.5 }}>COMPLETION SCALE</Text>
                        <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: proj.color }}>{proj.progress}%</Text>
                      </View>
                      <View style={[styles.progressBarTrack, { height: 3.5, backgroundColor: theme.border + '15' }]}>
                        <View style={[styles.progressBarFill, { width: `${proj.progress}%`, backgroundColor: proj.color }]} />
                      </View>
                    </View>

                    {/* Repository Path */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.03)', paddingTop: 8 }}>
                      <Terminal size={10} color={proj.color} />
                      <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 8.5, color: theme.text2, flex: 1 }} numberOfLines={1}>
                        {proj.repository}
                      </Text>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: theme.text }}>
                        {proj.price}
                      </Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>
        </Animated.View>
      )}

      {/* ========================================== */}
      {/* SOFTWARE ENGINEERING PROJECT DETAIL OVERLAY*/}
      {/* ========================================== */}
      {isSWEProjectVisible && selectedSWEProject && (
        <Animated.View 
          style={[styles.detailOverlay, sweProjectAnimatedStyle, { backgroundColor: theme.bg }]}
          {...sweProjectPanResponder.panHandlers}
        >
          <CEOBackground />
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={closeSWEProjectDetail} style={[styles.backBtn, { borderColor: theme.border }]}>
              <Text style={{ color: selectedSWEProject.color, fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11 }}>◀ BACK</Text>
            </TouchableOpacity>
            <Text style={[styles.overlayTitle, { color: theme.text }]}>SYSTEM DETAILS</Text>
            <View style={{ width: 68 }} />
          </View>

          <ScrollView contentContainerStyle={styles.overlayScroll} showsVerticalScrollIndicator={false}>
            
            {/* PROJECT LOGO / TITLE HEADER CARD */}
            <GlassCard style={[styles.clientDetailHeaderCard, { borderColor: selectedSWEProject.color + '30', padding: 18 }]}>
              <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                <View style={[styles.clientLogoUploader, { borderColor: selectedSWEProject.color + '50', width: 50, height: 50, borderRadius: 6 }]}>
                  <Code size={22} color={selectedSWEProject.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.clientDetailName, { color: theme.text, fontSize: 16.5 }]}>{selectedSWEProject.name}</Text>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8.5, color: theme.text2, letterSpacing: 0.5, marginTop: 2 }}>
                    {selectedSWEProject.service.toUpperCase()}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* AMOUNT EARNED */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>PROJECT CONTRACT PRICE</Text>
            <GlassCard style={{ padding: 16, marginBottom: 18, borderColor: selectedSWEProject.color + '20' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 9.5, color: theme.text2 }}>AMOUNT REVENUE RECORDED</Text>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 24, color: theme.text, marginTop: 4 }}>
                    {selectedSWEProject.price}
                  </Text>
                </View>
                <View style={{ borderWidth: 1, borderColor: '#10b981' + '40', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(16, 185, 129, 0.04)' }}>
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: '#10b981' }}>FULLY PAID</Text>
                </View>
              </View>
            </GlassCard>

            {/* DOCUMENTATION SECRETS */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>SECURE PROJECT DOCUMENTATION</Text>
            <GlassCard style={{ padding: 16, marginBottom: 18 }}>
              {selectedSWEProject.documentation.map((doc, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.historyRow, 
                    { paddingVertical: 10 },
                    idx !== selectedSWEProject.documentation.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 12 }}>
                      <ListTodo size={14} color={selectedSWEProject.color} />
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 11.5, color: theme.text }} numberOfLines={1}>
                        {doc}
                      </Text>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: theme.border + '30', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7, color: theme.text2 }}>SECURE</Text>
                    </View>
                  </View>
                </View>
              ))}
            </GlassCard>

            {/* COMPLETE ROADMAP / PLAN */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>COMPLETE ARCHITECTURE PLAN</Text>
            <GlassCard style={{ padding: 16, marginBottom: 18 }}>
              {selectedSWEProject.plan.map((step, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.historyRow, 
                    { paddingVertical: 10 },
                    idx !== selectedSWEProject.plan.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                  ]}
                >
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: selectedSWEProject.color + '18', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: selectedSWEProject.color + '40' }}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 7, color: selectedSWEProject.color }}>{idx + 1}</Text>
                    </View>
                    <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 11.5, color: theme.text, flex: 1 }}>
                      {step}
                    </Text>
                  </View>
                </View>
              ))}
            </GlassCard>

            {/* CHECKLIST */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>SYSTEM INTEGRITY CHECKLIST</Text>
            <GlassCard style={{ padding: 16, marginBottom: 18 }}>
              {selectedSWEProject.checklist.map((item, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.historyRow, 
                    { paddingVertical: 10 },
                    idx !== selectedSWEProject.checklist.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 12 }}>
                      <CheckCircle2 size={14} color={item.completed ? '#10b981' : theme.text2} />
                      <Text style={{ fontFamily: 'Syne_600SemiBold', fontSize: 11.5, color: item.completed ? theme.text : theme.text2 }} numberOfLines={1}>
                        {item.task}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 8, color: item.completed ? '#10b981' : theme.text2 }}>
                      {item.completed ? 'VERIFIED' : 'PENDING'}
                    </Text>
                  </View>
                </View>
              ))}
            </GlassCard>

            {/* GITHUB PROJECT REPO TERMINAL CARD */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>GITHUB SYSTEM REPOSITORY</Text>
            <GlassCard style={[styles.terminalRepoCard, { marginBottom: 18 }]}>
              <View style={styles.terminalHeader}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <View style={[styles.termDot, { backgroundColor: '#ef4444' }]} />
                  <View style={[styles.termDot, { backgroundColor: '#eab308' }]} />
                  <View style={[styles.termDot, { backgroundColor: '#10b981' }]} />
                </View>
                <View style={[styles.branchBadge, { borderColor: selectedSWEProject.color + '50', paddingHorizontal: 8, paddingVertical: 2.5 }]}>
                  <GitBranch size={11} color={selectedSWEProject.color} style={{ marginRight: 4 }} />
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10.5, color: selectedSWEProject.color }}>MAIN</Text>
                </View>
              </View>

              <View style={styles.terminalBody}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Terminal size={16} color={theme.text2} />
                  <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 13, color: theme.text }}>
                    {selectedSWEProject.repository}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* 5 LATEST COMMITS */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>5 LATEST REPOSITORY COMMITS</Text>
            <GlassCard style={{ padding: 16, marginBottom: 18 }}>
              {selectedSWEProject.commits.map((commit, idx) => (
                <View 
                  key={commit.hash} 
                  style={[
                    styles.historyRow, 
                    idx !== selectedSWEProject.commits.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={[styles.commitMsgText, { color: theme.text, fontSize: 12.5, lineHeight: 17 }]}>{commit.msg}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 6 }}>
                        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 9.5, color: theme.text2 }}>
                          Authored by: {commit.author}
                        </Text>
                        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 9.5, color: theme.text2 }}>•</Text>
                        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 9.5, color: selectedSWEProject.color }}>
                          {commit.time}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.hashBadge, { borderColor: theme.border + '30', paddingHorizontal: 6, paddingVertical: 2.5 }]}>
                      <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9.5, color: theme.text }}>
                        {commit.hash}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </GlassCard>

            {/* MARKETING PAGE ACTION BUTTON (marking page eka..) */}
            <Text style={[styles.sectionTitle, { color: theme.text2 }]}>ACQUISITION ANALYTICS</Text>
            <TouchableOpacity activeOpacity={0.8} style={[styles.marketingBtn, { borderColor: selectedSWEProject.color, marginBottom: 20 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} color={selectedSWEProject.color} />
                <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 10, color: selectedSWEProject.color, letterSpacing: 1.5 }}>
                  MARKETING ENGINE HUB
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 9, color: theme.text2 }}>{selectedSWEProject.marketingMetric}</Text>
                <ExternalLink size={12} color={selectedSWEProject.color} />
              </View>
            </TouchableOpacity>

          </ScrollView>
        </Animated.View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 120 },
  headerCard: {
    padding: 20,
    marginBottom: 20,
  },
  headerCardTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 12,
    letterSpacing: 2,
  },
  headerCardBio: {
    fontFamily: 'Syne_400Regular',
    fontSize: 11,
    marginTop: 10,
    lineHeight: 16,
  },
  skillCard: {
    padding: 16,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 6,
  },
  iconBoxLarge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 6,
  },
  skillName: {
    fontFamily: 'Syne_700Bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  percentageBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  skillBio: {
    fontFamily: 'Syne_400Regular',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  tagBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontFamily: 'Syne_700Bold',
    fontSize: 7.5,
    letterSpacing: 0.5,
  },
  footerVal: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 10,
  },

  // VERSTACK DETAIL SCREEN OVERLAY
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
  callHeaderBtn: {
    width: 32,
    height: 32,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  topProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 10,
    gap: 16,
  },
  squareAvatar: {
    width: 80,
    height: 80,
    borderWidth: 1.5,
    borderRadius: 6,
    position: 'relative',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUploadIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#eab308',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  logoTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 18,
    letterSpacing: 2,
    color: '#eab308',
    marginBottom: 2,
  },
  sloganText: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 10,
    textAlign: 'left',
    lineHeight: 14,
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  socialIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketingBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(234, 179, 8, 0.03)',
  },
  stateCountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 20,
  },
  countBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 8,
  },
  countNum: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 15,
  },
  countLabel: {
    fontFamily: 'Syne_700Bold',
    fontSize: 6.5,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  clientCard: {
    padding: 14,
    borderWidth: 1.5,
  },
  clientName: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 13,
  },
  clientStatusBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  historyRow: {
    paddingVertical: 14,
  },
  historyTaskText: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 12.5,
    lineHeight: 16,
  },
  categoryBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },

  // CLIENT DETAIL SPECIFIC STYLES
  clientDetailHeaderCard: {
    padding: 16,
    marginBottom: 20,
  },
  clientDetailName: {
    fontFamily: 'Syne_700Bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  clientLogoUploader: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderRadius: 6,
    position: 'relative',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  clientLogoUploadIcon: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#eab308',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  planBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  terminalRepoCard: {
    padding: 14,
    marginBottom: 20,
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 8,
    marginBottom: 12,
  },
  termDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  branchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  terminalBody: {
    paddingVertical: 4,
  },
  commitMsgText: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 14.5,
    lineHeight: 20,
  },
  hashBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  clientCardLogo: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  clientCardLogoImage: {
    width: '100%',
    height: '100%',
  },
  latestCommitBox: {
    borderStyle: 'dashed',
  },

  // FINANCIAL CONTRACT LEDGER STYLES
  smallActionBtn: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineForm: {
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  saveFormBtn: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  paymentRow: {
    paddingVertical: 10,
  },
  statusToggleBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
});
