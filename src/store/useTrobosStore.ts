import { create } from "zustand";
import { calculateDemoFare } from "@/lib/pricing";
import { nearestDemoWorkshop } from "@/lib/workshopRecommendation";
import { resolveDemoArrival } from "@/lib/journeyArrival";
import { advanceDemoTimeline } from "@/lib/demoTimeline";
import { persist } from "zustand/middleware";
import {
  TripStatus,
  UserProfile,
  Vehicle,
  TandemUnit,
  LocationPoint,
  ActiveTrip,
  TripHistoryItem,
  AppNotification,
  HandoverChecklist,
  BreakdownProblemId,
  BreakdownProblem,
  PassengerTransportOption,
  ServiceType,
  PaymentMethod,
  ChatMessage,
} from "@/types/trobos";
import {
  MOCK_USER,
  MOCK_VEHICLES,
  MOCK_LOCATIONS,
  WORKSHOP_DESTINATIONS,
  MOCK_TANDEM,
  MOCK_TOWING,
  DEFAULT_FARE,
  MOCK_TRIP_HISTORY,
  MOCK_NOTIFICATIONS,
  BREAKDOWN_PROBLEMS,
  getPassengerTransportOption,
} from "@/lib/mockData";

interface TrobosStore {
  // Theme & Onboarding
  theme: 'light' | 'dark';
  hasSeenTutorial: boolean;
  isTutorialOpen: boolean;
  isChatOpen: boolean;
  mapFocus: "off" | "passenger" | "tow";
  user: UserProfile;
  pickupLocation: LocationPoint;
  setPickupLocation: (location: LocationPoint) => void;
  vehicles: Vehicle[];
  activeVehicleId: string;
  selectedDestination: LocationPoint;
  selectedWorkshop: LocationPoint;
  carDestinationType: 'WORKSHOP' | 'SAME_AS_PASSENGER';
  selectedProblemId: BreakdownProblemId;
  passengerCount: number;
  serviceType: ServiceType;
  paymentMethod: PaymentMethod;
  damagePhotoUrl: string | null;
  damagePhotoNote: string;
  chatMessages: ChatMessage[];
  currentTrip: ActiveTrip | null;
  tripHistory: TripHistoryItem[];
  notifications: AppNotification[];
  isDemoRunning: boolean;
  demoTimerId: NodeJS.Timeout | null;
  demoTimers: ReturnType<typeof setTimeout>[];
  isDriverOnline: boolean;
  hasDriverIncomingOrder: boolean;
  isAuthenticated: boolean;

  // Actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setHasSeenTutorial: (seen: boolean) => void;
  setTutorialOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setMapFocus: (focus: "off" | "passenger" | "tow") => void;
  login: (email?: string, name?: string) => void;
  logout: () => void;
  setServiceType: (service: ServiceType) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDamagePhoto: (url: string | null, note?: string) => void;
  setSelectedDestination: (dest: LocationPoint) => void;
  setSelectedWorkshop: (shop: LocationPoint) => void;
  setCarDestinationType: (type: 'WORKSHOP' | 'SAME_AS_PASSENGER') => void;
  setSelectedProblemId: (id: BreakdownProblemId) => void;
  setPassengerCount: (count: number) => void;
  setActiveVehicleId: (id: string) => void;
  addVehicle: (v: Vehicle) => void;
  sendChatMessage: (text: string) => void;
  sendDriverDemoMessage: (text: string) => void;
  startBooking: (destination?: LocationPoint) => void;
  confirmBooking: () => void;
  returnToBooking: () => void;
  assignTandem: () => void;
  setApproaching: () => void;
  setArrived: () => void;
  verifyOtp: (code: string) => boolean;
  toggleChecklistItem: (key: keyof Omit<HandoverChecklist, 'fuelRecorded' | 'confirmed'>) => void;
  setHandoverFuel: (level: number) => void;
  confirmVehicleHandover: () => void;
  /** Advance all demo statuses with persisted timestamps, independent of the map. */
  tickDemoTimeline: (now?: number) => void;
  updateLiveProgress: (userProg: number, carProg: number, userEta: number, carEta: number) => void;
  userArrivedAtDest: () => void;
  carArrivedAtDest: () => void;
  completeTrip: (rating: number, tags: string[]) => void;
  resetToIdle: () => void;
  jumpToState: (targetStatus: TripStatus) => void;
  runAutoSimulation: () => void;
  stopAutoSimulation: () => void;
  toggleDriverOnline: () => void;
  setDriverIncoming: (has: boolean) => void;
  markNotificationAsRead: (id: string) => void;
}

const DEMO_GUEST: UserProfile = {
  ...MOCK_USER,
  name: "Pengunjung Demo",
  email: "",
  phone: "",
  rating: 0,
  emergencyContact: { name: "Belum diatur", phone: "", relation: "-" },
};

const INITIAL_HANDOVER: HandoverChecklist = {
  front: false,
  rear: false,
  left: false,
  right: false,
  interior: false,
  fuelRecorded: 65,
  problemConfirmed: false,
  confirmed: false,
};

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "system",
    senderName: "Sistem Trobos",
    text: "Pesan dan balasan di sini merupakan simulasi otomatis, bukan komunikasi dengan petugas.",
    timestamp: "Baru saja",
  },
  {
    id: "msg-2",
    sender: "rider",
    senderName: "Rizky Pratama (Rider)",
    text: "Halo! Ini adalah contoh percakapan demo. Tidak ada driver sungguhan yang ditugaskan.",
    timestamp: "1 mnt lalu",
  },
];

export const useTrobosStore = create<TrobosStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      hasSeenTutorial: false,
      isTutorialOpen: false,
      isChatOpen: false,
      mapFocus: "off",
      user: DEMO_GUEST,
      pickupLocation: MOCK_LOCATIONS.current,
      vehicles: MOCK_VEHICLES,
      activeVehicleId: MOCK_VEHICLES[0].id,
      selectedDestination: MOCK_LOCATIONS.destinations[0],
      selectedWorkshop: MOCK_LOCATIONS.workshops[0],
      carDestinationType: 'WORKSHOP',
      selectedProblemId: 'engine_failure',
      passengerCount: 1,
      serviceType: 'MECHANIC',
      paymentMethod: 'GOPAY',
      damagePhotoUrl: null,
      damagePhotoNote: "",
      chatMessages: INITIAL_CHAT_MESSAGES,
      currentTrip: null,
      tripHistory: MOCK_TRIP_HISTORY,
      notifications: MOCK_NOTIFICATIONS,
      isDemoRunning: false,
      demoTimerId: null,
      demoTimers: [],
      isDriverOnline: true,
      hasDriverIncomingOrder: false,
      isAuthenticated: false,

      toggleTheme: () => {
        const nextTheme = get().theme === 'light' ? 'dark' : 'light';
        if (typeof document !== 'undefined') {
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme: nextTheme });
      },

      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme });
      },

      setHasSeenTutorial: (seen) => set({ hasSeenTutorial: seen }),
      setTutorialOpen: (open) => set({ isTutorialOpen: open }),
      setChatOpen: (open) => set({ isChatOpen: open }),
      setMapFocus: (mapFocus) => set({ mapFocus }),
      setServiceType: (serviceType) => set({ serviceType, carDestinationType: serviceType === "MECHANIC" ? "WORKSHOP" : "SAME_AS_PASSENGER" }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setDamagePhoto: (url, note = "") => set({ damagePhotoUrl: url, damagePhotoNote: note }),

      login: (email, name) => {
        set((state) => ({
          isAuthenticated: true,
          user: {
            ...state.user,
            name: name || state.user.name || "Pengunjung Demo",
            email: email || "",
            phone: "",
            emergencyContact: { name: "Belum disetel", relation: "-", phone: "" },
          },
        }));
      },

      logout: () => {
        get().stopAutoSimulation();
        if (typeof window !== "undefined") {
          try { localStorage.removeItem("trobos_app_storage"); } catch {}
        }
        // Do not retain the previous user's private state in a shared browser.
        set({
          isAuthenticated: false,
          currentTrip: null,
          user: DEMO_GUEST,
          vehicles: MOCK_VEHICLES,
          activeVehicleId: MOCK_VEHICLES[0].id,
          pickupLocation: MOCK_LOCATIONS.current,
          tripHistory: [],
          chatMessages: [],
          notifications: [],
          isDemoRunning: false,
          damagePhotoUrl: null,
          damagePhotoNote: "",
        });
      },

      setPickupLocation: (location) => set({ pickupLocation: location }),
      setSelectedDestination: (dest) => set({
        selectedDestination: dest,
        // Changing a passenger destination also changes the recommended
        // destination for the rescue vehicle (not the origin).
        selectedWorkshop: nearestDemoWorkshop(dest, WORKSHOP_DESTINATIONS) || WORKSHOP_DESTINATIONS[0],
      }),
      setSelectedWorkshop: (shop) => set({ selectedWorkshop: shop }),
      setCarDestinationType: (type) => set({ carDestinationType: type }),
      setSelectedProblemId: (id) => set({ selectedProblemId: id }),
      setPassengerCount: (count) => {
        const validated = Math.max(1, Math.min(8, count));
        set({ passengerCount: validated });
      },
      setActiveVehicleId: (id) => set({ activeVehicleId: id }),

      addVehicle: (v) =>
        set((state) => ({
          vehicles: [...state.vehicles, v],
          activeVehicleId: v.id,
        })),

      sendChatMessage: (text) => {
        const tripId = get().currentTrip?.id;
        if (!tripId || !text.trim()) return;
        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "user",
          senderName: get().user.name,
          text,
          timestamp: "Baru saja",
        };

        set((state) => ({ chatMessages: [...state.chatMessages, userMsg] }));

      },

      sendDriverDemoMessage: (text) => {
        if (!get().currentTrip || !text.trim()) return;
        const driverMessage: ChatMessage = {
          id: "driver-demo-" + Date.now() + "-" + Math.random().toString(36).slice(2,7),
          sender: "driver",
          senderName: "Operator TROBOS (Demo Browser)",
          text: text.trim().slice(0, 300),
          timestamp: "Baru saja",
        };
        set(state => ({chatMessages: [...state.chatMessages, driverMessage]}));
      },

      startBooking: (destination) => {
        const state = get();
        const activeVeh =
          state.vehicles.find((v) => v.id === state.activeVehicleId) || state.vehicles[0];
        const dest = destination || state.selectedDestination;
        const workshop = nearestDemoWorkshop(dest, WORKSHOP_DESTINATIONS) || state.selectedWorkshop;
        const carDest = state.serviceType === "MECHANIC" ? workshop : dest;

        const problem =
          BREAKDOWN_PROBLEMS.find((p) => p.id === state.selectedProblemId) ||
          BREAKDOWN_PROBLEMS[0];

        const passengerTransport = getPassengerTransportOption(state.passengerCount);

        const calculatedFare = calculateDemoFare({
          serviceType: state.serviceType,
          origin: state.pickupLocation,
          passengerDestination: dest,
          carDestination: carDest,
          passengerCount: state.passengerCount,
        });

        const newTrip: ActiveTrip = {
          id: `TRB-${Math.floor(10000 + Math.random() * 90000)}`,
          status: "REQUESTED",
          serviceType: state.serviceType,
          paymentMethod: state.paymentMethod,
          origin: state.pickupLocation,
          destination: dest,
          carDestination: carDest,
          carDestinationType: state.serviceType === "MECHANIC" ? "WORKSHOP" : "SAME_AS_PASSENGER",
          problem,
          passengerCount: state.passengerCount,
          passengerTransport,
          vehicle: activeVeh,
          tandem: null,
          towingUnit: MOCK_TOWING,
          fare: calculatedFare,
          otpCode: "4821",
          handover: INITIAL_HANDOVER,
          userProgressPercent: 0,
          carProgressPercent: 0,
          userEtaMinutes: calculatedFare.estimatedPassengerMinutes,
          carEtaMinutes: calculatedFare.estimatedTowingMinutes,
          damagePhotoUrl: state.damagePhotoUrl,
          damagePhotoNote: state.damagePhotoNote,
          createdAt: new Date().toISOString(),
        };

        set({ currentTrip: newTrip, chatMessages: INITIAL_CHAT_MESSAGES });
      },

      confirmBooking: () => {
        // Reconcile the order with the final form choices; never dispatch a stale draft.
        const state = get();
        const trip = state.currentTrip;
        if (!trip || trip.status !== "REQUESTED") return;
        const vehicle = state.vehicles.find((v) => v.id === state.activeVehicleId);
        if (!vehicle || !Number.isInteger(state.passengerCount) || state.passengerCount < 1 || state.passengerCount > 8) return;
        const mechanic = state.serviceType === "MECHANIC";
        const destination = state.selectedDestination;
        const carDestination = mechanic
          ? nearestDemoWorkshop(destination, WORKSHOP_DESTINATIONS) || state.selectedWorkshop
          : destination;
        const fare = calculateDemoFare({
          serviceType: state.serviceType,
          origin: state.pickupLocation,
          passengerDestination: destination,
          carDestination,
          passengerCount: state.passengerCount,
        });
        const problem = BREAKDOWN_PROBLEMS.find((p) => p.id === state.selectedProblemId) || BREAKDOWN_PROBLEMS[0];
        set({
          currentTrip: {
            ...trip,
            status: "SEARCHING_TANDEM",
            searchStartedAt: Date.now(),
            approachStartedAt: undefined,
            travelStartedAt: undefined,
            origin: state.pickupLocation,
            serviceType: state.serviceType,
            paymentMethod: state.paymentMethod,
            vehicle,
            passengerCount: state.passengerCount,
            passengerTransport: getPassengerTransportOption(state.passengerCount),
            problem,
            destination,
            carDestination,
            carDestinationType: mechanic ? "WORKSHOP" : "SAME_AS_PASSENGER",
            damagePhotoUrl: state.damagePhotoUrl,
            damagePhotoNote: state.damagePhotoNote,
            handover: { ...INITIAL_HANDOVER },
            fare,
            userEtaMinutes: fare.estimatedPassengerMinutes,
            carEtaMinutes: fare.estimatedTowingMinutes,
          },
        });
      },

      returnToBooking: () => set((state) => state.currentTrip ? ({
        currentTrip: { ...state.currentTrip, status: "REQUESTED", tandem: null, searchStartedAt: undefined },
      }) : {}),

      assignTandem: () => {
        set((state) => {
          if (state.currentTrip?.status !== "SEARCHING_TANDEM") return {};
          return {
            currentTrip: {
              ...state.currentTrip,
              status: "TANDEM_ASSIGNED",
              tandem: MOCK_TANDEM,
            },
          };
        });
      },

      setApproaching: () => {
        set((state) => {
          if (state.currentTrip?.status !== "TANDEM_ASSIGNED") return {};
          return {
            currentTrip: {
              ...state.currentTrip,
              status: "TANDEM_APPROACHING",
              approachStartedAt: Date.now(),
              tandem: state.currentTrip.tandem || MOCK_TANDEM,
            },
          };
        });
      },

      setArrived: () => {
        set((state) => {
          if (state.currentTrip?.status !== "TANDEM_APPROACHING") return {};
          return {
            currentTrip: {
              ...state.currentTrip,
              status: "TANDEM_ARRIVED",
            },
          };
        });
      },

      verifyOtp: (code: string) => {
        const trip = get().currentTrip;
        if (!trip || (trip.status !== "TANDEM_ARRIVED" && trip.status !== "VERIFICATION")) return false;
        if (code === trip.otpCode) {
          set({
            currentTrip: {
              ...trip,
              status: "VEHICLE_HANDOVER",
            },
          });
          return true;
        }
        return false;
      },

      toggleChecklistItem: (key) => {
        set((state) => {
          if (!state.currentTrip) return {};
          const currentVal = state.currentTrip.handover[key];
          return {
            currentTrip: {
              ...state.currentTrip,
              handover: {
                ...state.currentTrip.handover,
                [key]: !currentVal,
              },
            },
          };
        });
      },

      setHandoverFuel: (level) => {
        set((state) => {
          if (!state.currentTrip) return {};
          return {
            currentTrip: {
              ...state.currentTrip,
              handover: {
                ...state.currentTrip.handover,
                fuelRecorded: Math.max(0, Math.min(100, Number.isFinite(level) ? level : 0)),
              },
            },
          };
        });
      },

      confirmVehicleHandover: () => {
        set((state) => {
          if (state.currentTrip?.status !== "VEHICLE_HANDOVER") return {};
          const { handover } = state.currentTrip;
          if (!handover.front || !handover.rear || !handover.left || !handover.right || !handover.interior || !handover.problemConfirmed) return {};
          return {
            currentTrip: {
              ...state.currentTrip,
              status: "TRIP_STARTED",
              travelStartedAt: Date.now(),
              handover: {
                ...state.currentTrip.handover,
                confirmed: true,
              },
            },
          };
        });
      },

      tickDemoTimeline: (now = Date.now()) => {
        set(state => {
          const active = state.currentTrip;
          if (!active) return {};
          const { trip, changed } = advanceDemoTimeline(active, now);
          if (!changed) return {};
          return {
            currentTrip: trip.status === "TANDEM_ASSIGNED" && !trip.tandem
              ? { ...trip, tandem: MOCK_TANDEM } : trip,
          };
        });
      },

      updateLiveProgress: (userProg, carProg, userEta, carEta) => {
        set((state) => {
          const trip=state.currentTrip;
          if (!trip || !["TRIP_STARTED","USER_ARRIVED","VEHICLE_ARRIVED"].includes(trip.status)) return {};
          const percentage=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(100,n)):0;
          const passenger=Math.max(trip.userProgressPercent,percentage(userProg));
          const vehicle=Math.max(trip.carProgressPercent,percentage(carProg));
          return {
            currentTrip:{
              ...trip,
              userProgressPercent:passenger,
              carProgressPercent:vehicle,
              userEtaMinutes:passenger>=100?0:Math.max(0,userEta),
              carEtaMinutes:vehicle>=100?0:Math.max(0,carEta),
            },
          };
        });
      },

      userArrivedAtDest: () => {
        set(state => {
          const trip=state.currentTrip;
          if(!trip)return {};
          const next=resolveDemoArrival(trip.status,trip.userProgressPercent,trip.carProgressPercent,"passenger");
          if(!next)return {};
          return { currentTrip:{
            ...trip,
            status:next.status,
            userProgressPercent:next.passengerProgress,
            carProgressPercent:next.vehicleProgress,
            userEtaMinutes:0,
            carEtaMinutes:next.vehicleProgress===100?0:trip.carEtaMinutes,
          }};
        });
      },

      carArrivedAtDest: () => {
        set(state => {
          const trip=state.currentTrip;
          if(!trip)return {};
          const next=resolveDemoArrival(trip.status,trip.userProgressPercent,trip.carProgressPercent,"vehicle");
          if(!next)return {};
          return { currentTrip:{
            ...trip,
            status:next.status,
            userProgressPercent:next.passengerProgress,
            carProgressPercent:next.vehicleProgress,
            carEtaMinutes:0,
            userEtaMinutes:next.passengerProgress===100?0:trip.userEtaMinutes,
          }};
        });
      },

      completeTrip: (rating, tags) => {
        const state = get();
        if (state.currentTrip?.status !== "COMPLETED") return;

        const completedItem: TripHistoryItem = {
          id: state.currentTrip.id,
          date: new Date().toISOString(),
          serviceType: state.currentTrip.serviceType,
          paymentMethod: state.currentTrip.paymentMethod,
          origin: state.currentTrip.origin.name,
          destination: state.currentTrip.destination.name,
          carDestination: state.currentTrip.carDestination.name,
          problemLabel: state.currentTrip.problem.label,
          passengerCount: state.currentTrip.passengerCount,
          passengerTransportType: state.currentTrip.passengerTransport.type,
          fare: state.currentTrip.fare.totalFare,
          distanceKm: state.currentTrip.fare.distanceKm,
          status: "Completed",
          vehiclePlate: state.currentTrip.vehicle.plate,
          riderName: state.currentTrip.passengerTransport.driverName || "Rizky Pratama",
          driverName: state.currentTrip.towingUnit.operatorName || "Budi Santoso",
          rating: rating || 5,
        };

        set({
          currentTrip: {
            ...state.currentTrip,
            status: "COMPLETED",
            rating,
            feedbackTags: tags,
          },
          tripHistory: [completedItem, ...state.tripHistory.filter((t) => t.id !== completedItem.id)],
        });
      },

      resetToIdle: () => {
        get().stopAutoSimulation();
        set({
          currentTrip: null,
          mapFocus: "off",
          isDemoRunning: false,
        });
      },

      jumpToState: (targetStatus) => {
        get().stopAutoSimulation();
        const state = get();
        const activeVeh =
          state.vehicles.find((v) => v.id === state.activeVehicleId) || state.vehicles[0];

        if (targetStatus === "IDLE") {
          set({ currentTrip: null, mapFocus: "off", isDemoRunning: false });
          return;
        }

        const problem =
          BREAKDOWN_PROBLEMS.find((p) => p.id === state.selectedProblemId) ||
          BREAKDOWN_PROBLEMS[0];
        const passengerTransport = getPassengerTransportOption(state.passengerCount);

        const baseTrip: ActiveTrip = state.currentTrip || {
          id: `TRB-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
          status: targetStatus,
          serviceType: state.serviceType,
          paymentMethod: state.paymentMethod,
          origin: state.pickupLocation,
          destination: state.selectedDestination,
          carDestination: state.serviceType === "MECHANIC"
            ? nearestDemoWorkshop(state.selectedDestination, WORKSHOP_DESTINATIONS) || state.selectedWorkshop
            : state.selectedDestination,
          carDestinationType: state.serviceType === "MECHANIC" ? "WORKSHOP" : "SAME_AS_PASSENGER",
          problem,
          passengerCount: state.passengerCount,
          passengerTransport,
          vehicle: activeVeh,
          tandem: MOCK_TANDEM,
          towingUnit: MOCK_TOWING,
          fare: DEFAULT_FARE,
          otpCode: "4821",
          handover: INITIAL_HANDOVER,
          userProgressPercent: 35,
          carProgressPercent: 20,
          userEtaMinutes: 12,
          carEtaMinutes: 25,
          damagePhotoUrl: state.damagePhotoUrl,
          damagePhotoNote: state.damagePhotoNote,
          createdAt: new Date().toISOString(),
        };

        let userProg = baseTrip.userProgressPercent;
        let carProg = baseTrip.carProgressPercent;
        let userEta = baseTrip.userEtaMinutes;
        let carEta = baseTrip.carEtaMinutes;

        if (targetStatus === "TRIP_STARTED") {
          // One-tap preview animates both units from the start of the route.
          userProg = 0;
          carProg = 0;
          userEta = 2;
          carEta = 3;
        } else if (targetStatus === "USER_ARRIVED") {
          userProg = 100;
          carProg = 65;
          userEta = 0;
          carEta = 12;
        } else if (targetStatus === "VEHICLE_ARRIVED" || targetStatus === "COMPLETED") {
          userProg = 100;
          carProg = 100;
          userEta = 0;
          carEta = 0;
        }

        set({
          currentTrip: {
            ...baseTrip,
            status: targetStatus,
            searchStartedAt: targetStatus === "SEARCHING_TANDEM" ? Date.now() : undefined,
            approachStartedAt: targetStatus === "TANDEM_APPROACHING" ? Date.now() : undefined,
            travelStartedAt: ["TRIP_STARTED", "USER_ARRIVED", "VEHICLE_ARRIVED"].includes(targetStatus)
              ? Date.now() : undefined,
            tandem: MOCK_TANDEM,
            towingUnit: MOCK_TOWING,
            userProgressPercent: userProg,
            carProgressPercent: carProg,
            userEtaMinutes: userEta,
            carEtaMinutes: carEta,
          },
        });
      },

      runAutoSimulation: () => {
        get().stopAutoSimulation();
        get().startBooking();
        get().confirmBooking();
        set({ isDemoRunning: true });
        const schedule = (fn: () => void, delay: number) => setTimeout(() => {
          if (get().isDemoRunning) fn();
        }, delay);
        const timers = [
          schedule(() => get().assignTandem(), 10000),
          schedule(() => get().setApproaching(), 21000),
          schedule(() => get().setArrived(), 59000),
          schedule(() => get().verifyOtp(get().currentTrip?.otpCode || ""), 72000),
          schedule(() => {
            const handover = get().currentTrip?.handover;
            if (handover) for (const key of ["front", "rear", "left", "right", "interior", "problemConfirmed"] as const) {
              if (!handover[key]) get().toggleChecklistItem(key);
            }
            get().confirmVehicleHandover();
          }, 85000),
          schedule(() => get().userArrivedAtDest(), 198000),
          schedule(() => get().carArrivedAtDest(), 220000),
          schedule(() => {
            get().completeTrip(5, ["Demo selesai"]);
            set({ isDemoRunning: false, demoTimers: [] });
          }, 230000),
        ];
        set({ demoTimers: timers });
      },

      stopAutoSimulation: () => {
        get().demoTimers.forEach(clearTimeout);
        set({ isDemoRunning: false, demoTimers: [] });
      },

      toggleDriverOnline: () =>
        set((state) => ({ isDriverOnline: !state.isDriverOnline })),

      setDriverIncoming: (has) =>
        set({ hasDriverIncomingOrder: has }),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
    }),
    {
      name: "trobos_app_storage",
      // Older demos placed the sample SCBD workshop at exactly the same
      // coordinates as Pacific Place. Recalculate persisted rescue trips so
      // refreshing the browser does not resurrect the overlapping route.
      version: 2,
      migrate: (persisted) => {
        const previous = persisted as Pick<TrobosStore,
          "theme" | "hasSeenTutorial" | "user" | "vehicles" | "activeVehicleId"
          | "selectedDestination" | "pickupLocation" | "selectedWorkshop"
          | "carDestinationType" | "selectedProblemId" | "passengerCount"
          | "serviceType" | "paymentMethod" | "tripHistory" | "currentTrip"
        >;
        const trip = previous.currentTrip;
        if (!trip || trip.serviceType !== "MECHANIC") return previous;
        const workshop = nearestDemoWorkshop(trip.destination, WORKSHOP_DESTINATIONS);
        if (!workshop) return previous;
        return {
          ...previous,
          selectedWorkshop: workshop,
          currentTrip: { ...trip, carDestination: workshop, carDestinationType: "WORKSHOP" as const },
        };
      },
      partialize: (state) => ({
        theme: state.theme,
        hasSeenTutorial: state.hasSeenTutorial,
        user: state.user,
        vehicles: state.vehicles,
        activeVehicleId: state.activeVehicleId,
        selectedDestination: state.selectedDestination,
        pickupLocation: state.pickupLocation,
        selectedWorkshop: state.selectedWorkshop,
        carDestinationType: state.carDestinationType,
        selectedProblemId: state.selectedProblemId,
        passengerCount: state.passengerCount,
        serviceType: state.serviceType,
        paymentMethod: state.paymentMethod,
        tripHistory: state.tripHistory,
        currentTrip: state.currentTrip,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
