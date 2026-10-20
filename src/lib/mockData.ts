import {
  UserProfile,
  Vehicle,
  Rider,
  Driver,
  TowingUnit,
  TandemUnit,
  LocationPoint,
  FareBreakdown,
  TripHistoryItem,
  AppNotification,
  BreakdownProblem,
  BreakdownProblemId,
  PassengerTransportOption,
} from "@/types/trobos";

export const MOCK_USER: UserProfile = {
  id: "usr_trobos_01",
  name: "Andi Pratama",
  email: "andi.pratama@gmail.com",
  phone: "+62 812-3456-7890",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
  rating: 4.96,
  emergencyContact: {
    name: "Ratna Dewi (Istri)",
    phone: "+62 811-9876-5432",
    relation: "Istri",
  },
};

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "veh_01",
    brand: "Honda",
    model: "Civic RS Turbo",
    year: 2023,
    color: "Meteoroid Gray",
    plate: "B 1234 XYZ",
    fuelLevel: 65,
    stnkVerified: true,
    type: "Sedan",
    transmission: "Automatic",
  },
  {
    id: "veh_02",
    brand: "Toyota",
    model: "Innova Zenix Hybrid",
    year: 2024,
    color: "Platinum White Pearl",
    plate: "B 7890 KLR",
    fuelLevel: 80,
    stnkVerified: true,
    type: "MPV",
    transmission: "Automatic",
  },
];

export const BREAKDOWN_PROBLEMS: BreakdownProblem[] = [
  {
    id: "engine_failure",
    label: "Mesin Mati",
    description: "Mesin tiba-tiba mati total di jalan & tidak bisa dihidupkan.",
    iconName: "AlertTriangle",
    severity: "high",
  },
  {
    id: "flat_tire",
    label: "Ban Bocor / Pecah",
    description: "Ban kempes atau sobek, tidak aman untuk lanjut jalan.",
    iconName: "CircleDot",
    severity: "medium",
  },
  {
    id: "battery_dead",
    label: "Aki Habis / Drop",
    description: "Kelistrikan mati, tidak ada daya sama sekali.",
    iconName: "BatteryWarning",
    severity: "medium",
  },
  {
    id: "overheat",
    label: "Overheat",
    description: "Indikator temperatur merah atau uap keluar dari kap mesin.",
    iconName: "Flame",
    severity: "high",
  },
  {
    id: "starter_failure",
    label: "Tidak Bisa Starter",
    description: "Mesin tidak merespon tombol/kunci kontak sama sekali.",
    iconName: "KeyRound",
    severity: "medium",
  },
  {
    id: "minor_accident",
    label: "Kecelakaan Ringan",
    description: "Benturan ringan, bumper atau roda terkunci butuh evakuasi.",
    iconName: "ShieldAlert",
    severity: "high",
  },
  {
    id: "unknown",
    label: "Masalah Lainnya",
    description: "Kendala teknis lainnya atau mogok tak teridentifikasi.",
    iconName: "HelpCircle",
    severity: "low",
  },
];

export const WORKSHOP_DESTINATIONS: LocationPoint[] = [
  {
    name: "Bengkel Resmi Honda Autoland SCBD",
    address: "Jl. Jend. Sudirman Kav. 52-53, Senayan, Jakarta Selatan",
    lat: -6.2244,
    lng: 106.8098,
    areaTag: "Contoh Bengkel — Kemitraan Belum Terverifikasi",
  },
  {
    name: "Toyota Auto2000 Cilandak & Towing Hub",
    address: "Jl. TB Simatupang No. 45, Cilandak Barat, Jakarta Selatan",
    lat: -6.2912,
    lng: 106.7972,
    areaTag: "Bengkel Resmi & Stasiun Derek Siaga",
  },
  {
    name: "Astra Otoservice 24 Jam Gatot Subroto",
    address: "Jl. Gatot Subroto Kav. 36, Kuningan Barat, Jakarta Selatan",
    lat: -6.2378,
    lng: 106.8291,
    areaTag: "Layanan Cepat & Diagnosis Mesin",
  },
  {
    name: "BOS Bengkel Otomotif Senayan",
    address: "Jl. Asia Afrika No. 19, Gelora, Tanah Abang",
    lat: -6.2198,
    lng: 106.7995,
    areaTag: "Spesialis Kaki-kaki & Ban 24 Jam",
  },
];

/** Selectable demonstration pickups: illustrative coordinates, not live emergency locations. */
export const DEMO_PICKUP_POINTS: LocationPoint[] = [
  {
    name: "Sudirman — Mayapada Tower",
    address: "Karet Semanggi, Jakarta Selatan (titik contoh)",
    lat: -6.2155, lng: 106.8217, areaTag: "Sudirman",
  },
  {
    name: "Mega Kuningan",
    address: "Setiabudi, Jakarta Selatan (titik contoh)",
    lat: -6.2285, lng: 106.8268, areaTag: "Kuningan",
  },
  {
    name: "SCBD — Pacific Place",
    address: "Senayan, Jakarta Selatan (titik contoh)",
    lat: -6.2244, lng: 106.8098, areaTag: "SCBD",
  },
  {
    name: "Senayan — Gelora Bung Karno",
    address: "Gelora, Jakarta Pusat (titik contoh)",
    lat: -6.2198, lng: 106.7995, areaTag: "Senayan",
  },
  {
    name: "Pondok Indah",
    address: "Kebayoran Lama, Jakarta Selatan (titik contoh)",
    lat: -6.2755, lng: 106.7821, areaTag: "Pondok Indah",
  },
];
export const MOCK_LOCATIONS: {
  current: LocationPoint;
  destinations: LocationPoint[];
  workshops: LocationPoint[];
} = {
  current: DEMO_PICKUP_POINTS[0],
  destinations: [
    {
      name: "Pacific Place / SCBD (Kantor)",
      address: "Jl. Jend. Sudirman Kav 52-53, Senayan, Kebayoran Baru",
      lat: -6.2244,
      lng: 106.8098,
      areaTag: "Pusat Bisnis SCBD",
    },
    {
      name: "Bandara Soekarno-Hatta (Terminal 3)",
      address: "Pajang, Benda, Kota Tangerang, Banten",
      lat: -6.1256,
      lng: 106.6559,
      areaTag: "Keberangkatan Pesawat",
    },
    {
      name: "Kediaman Rumah (Pondok Indah)",
      address: "Jl. Metro Pondok Indah Blok TB, Kebayoran Lama",
      lat: -6.2755,
      lng: 106.7821,
      areaTag: "Area Perumahan",
    },
    {
      name: "Mega Kuningan (World Capital Tower)",
      address: "Jl. Mega Kuningan Barat No. 3, Setiabudi",
      lat: -6.2285,
      lng: 106.8268,
      areaTag: "Kuningan Diplomatic Zone",
    },
  ],
  workshops: WORKSHOP_DESTINATIONS,
};

export function getPassengerTransportOption(count: number): PassengerTransportOption {
  if (count <= 1) {
    return {
      type: "MOTOR",
      title: "Motor Penjemput Eksekutif",
      capacityLabel: "1 Penumpang",
      description: "Pilihan paling gesit untuk 1 orang menembus lalu lintas menuju destinasi.",
      recommendedFor: "Paling cepat untuk 1 orang",
      vehicleModel: "Yamaha NMAX 155 Connected",
      driverName: "Rizky Pratama",
      driverPhone: "+62 813-8822-9011",
      driverRating: 4.92,
      plate: "B 6890 PQR",
    };
  }

  if (count === 2) {
    return {
      type: "CAR",
      title: "Mobil Pengganti (Sedan/Hatchback)",
      capacityLabel: "2 Penumpang",
      description: "Nyaman untuk berdua dengan AC dan ruang bagasi barang bawaan.",
      recommendedFor: "Sangat direkomendasikan untuk 2 penumpang",
      vehicleModel: "Toyota Vios G Grade",
      driverName: "Dimas Anggara",
      driverPhone: "+62 812-9988-1122",
      driverRating: 4.89,
      plate: "B 2145 KLO",
    };
  }

  if (count <= 4) {
    return {
      type: "CAR",
      title: "Mobil Pengganti Rombongan (MPV Nyaman)",
      capacityLabel: "3–4 Penumpang",
      description: "Kabin lega untuk seluruh rombongan mobil yang mogok.",
      recommendedFor: "Kapasitas tepat untuk rombongan 3–4 orang",
      vehicleModel: "Toyota Innova Zenix Hybrid",
      driverName: "Hendra Wijaya",
      driverPhone: "+62 811-3322-7788",
      driverRating: 4.95,
      plate: "B 3344 TRB",
    };
  }

  return {
    type: "VAN",
    title: "Armada Pengganti Besar (Van / Multi-Armada)",
    capacityLabel: `${count} Penumpang`,
    description: "Van berkapasitas besar agar seluruh rombongan tetap berangkat bersamaan.",
    recommendedFor: `Disesuaikan untuk rombongan ${count} orang`,
    vehicleModel: "Toyota HiAce Premio Luxury",
    driverName: "Bambang Sudiro",
    driverPhone: "+62 815-4433-2211",
    driverRating: 4.97,
    plate: "B 8899 BUS",
  };
}

export const MOCK_TOWING: TowingUnit = {
  operatorName: "Pak Slamet Riyadi",
  operatorPhone: "+62 812-7711-4455",
  operatorRating: 4.95,
  truckModel: "Isuzu Giga Towing Gendong Flatbed",
  plate: "B 9812 TOW",
  type: "Truk Towing Gendong Flatbed",
};

export const MOCK_RIDER: Rider = {
  id: "rdr_88",
  name: "Rizky Pratama",
  rating: 4.88,
  tripsCount: 1420,
  phone: "+62 813-8822-9011",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  bikeModel: "Yamaha NMAX 155 Connected",
  plate: "B 6890 PQR",
};

export const MOCK_DRIVER: Driver = {
  id: "drv_99",
  name: "Budi Santoso",
  rating: 4.95,
  tripsCount: 980,
  phone: "+62 812-7711-4455",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
  licenseNumber: "SIM B1 Umum Verified",
  safetyBadge: "Certified Master Towing Operator",
  badgeType: "Gold Master",
};

export const MOCK_TANDEM: TandemUnit = {
  rider: MOCK_RIDER,
  driver: MOCK_DRIVER,
  towing: MOCK_TOWING,
};

export const DEFAULT_FARE: FareBreakdown = {
  baseFare: 45000,
  emergencyService: 45000, // layanan rescue siaga
  distanceFare: 20000,
  towingFare: 110000,     // armada truk towing gendong
  surgeFare: 0,
  totalFare: 220000,
  distanceKm: 6.8,
  estimatedPassengerMinutes: 18,
  estimatedTowingMinutes: 32,
};

export const MOCK_TRIP_HISTORY: TripHistoryItem[] = [
  {
    id: "TRB-90211",
    date: "2026-09-15T17:45:00Z",
    origin: "Gatot Subroto (Wisma Mulia)",
    destination: "Stasiun Gambir Pintu Timur",
    carDestination: "Bengkel Resmi Honda Autoland SCBD",
    problemLabel: "Mesin Mati",
    passengerCount: 1,
    passengerTransportType: "MOTOR",
    fare: 220000,
    distanceKm: 9.4,
    status: "Completed",
    vehiclePlate: "B 1234 XYZ",
    riderName: "Rizky Pratama",
    driverName: "Pak Slamet (Towing)",
    rating: 5,
  },
  {
    id: "TRB-88319",
    date: "2026-09-10T08:30:00Z",
    origin: "Kuningan City",
    destination: "SCBD Lot 8",
    carDestination: "Astra Otoservice 24 Jam Gatot Subroto",
    problemLabel: "Aki Habis / Drop",
    passengerCount: 3,
    passengerTransportType: "CAR",
    fare: 260000,
    distanceKm: 4.8,
    status: "Completed",
    vehiclePlate: "B 1234 XYZ",
    riderName: "Hendra Wijaya (Mobil Pengganti)",
    driverName: "Pak Slamet (Towing)",
    rating: 5,
  },
  {
    id: "TRB-77102",
    date: "2026-08-28T18:15:00Z",
    origin: "Rasuna Said (KPK)",
    destination: "Senayan City Mall",
    carDestination: "Toyota Auto2000 Cilandak",
    problemLabel: "Ban Bocor / Pecah",
    passengerCount: 2,
    passengerTransportType: "CAR",
    fare: 245000,
    distanceKm: 7.2,
    status: "Completed",
    vehiclePlate: "B 1234 XYZ",
    riderName: "Dimas Anggara",
    driverName: "Pak Slamet (Towing)",
    rating: 5,
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_1",
    title: "Unit Rescue & Towing Diberangkatkan!",
    message: "Truk Towing Flatbed dan Kendaraan Pengganti sedang menuju titik mogok Anda di Sudirman.",
    timestamp: "2 menit lalu",
    read: false,
    type: "alert",
  },
  {
    id: "notif_2",
    title: "Inspeksi Mobil Mogok Selesai",
    message: "Honda Civic RS Anda aman dinaikkan ke truk gendong dengan catatan checklist lengkap.",
    timestamp: "15 menit lalu",
    read: false,
    type: "info",
  },
  {
    id: "notif_3",
    title: "Contoh: Mobil Tiba di Bengkel",
    message: "Ini hanya contoh notifikasi perjalanan. Belum ada proses penerimaan kendaraan nyata.",
    timestamp: "2 hari lalu",
    read: true,
    type: "success",
  },
  {
    id: "notif_4",
    title: "Ilustrasi Program Proteksi",
    message: "Proteksi asuransi Rp 1 miliar adalah bagian konsep; belum ada polis aktif pada demo.",
    timestamp: "3 hari lalu",
    read: true,
    type: "info",
  },
];

export const FAQS = [
  {
    q: "Bagaimana cara kerja layanan Trobos saat mobil saya mogok?",
    a: "Ketika mobil Anda mogok, Trobos mengirimkan solusi terpadu dalam satu panggilan: (1) Unit Truk Towing Gendong untuk mengevakuasi mobil Anda ke bengkel rekanan atau lokasi pilihan Anda, dan (2) Kendaraan Pengganti yang disesuaikan dengan jumlah penumpang agar Anda dan rombongan tidak tertahan di jalan dan segera sampai tujuan.",
  },
  {
    q: "Bagaimana kendaraan pengganti penumpang ditentukan?",
    a: "Kendaraan pengganti ditentukan secara dinamis berdasarkan jumlah orang di dalam mobil. Untuk 1 penumpang, kami sediakan motor penjemput gesit agar segera tiba di tujuan. Untuk 2–4 penumpang, kami kirimkan mobil pengganti ber-AC. Untuk rombongan lebih dari 4 orang, kami siapkan van berkapasitas besar.",
  },
  {
    q: "Apakah mobil mogok saya aman selama proses derek/towing?",
    a: "Dalam prototipe ini, towing flatbed, inspeksi PIN, dan perlindungan asuransi merupakan rancangan fitur. Belum ada armada, operator, ataupun polis yang terverifikasi.",
  },
  {
    q: "Apakah mobil saya harus dibawa ke bengkel rekanan?",
    a: "Untuk demo, Anda bisa memilih bengkel contoh atau tujuan yang sama dengan penumpang. Kemitraan dan antrean layanan belum dikonfirmasi secara operasional.",
  },
  {
    q: "Bagaimana jika saya sampai ke tujuan terlebih dahulu daripada mobil saya?",
    a: "Konsep Trobos memisahkan penanganan penumpang dan kendaraan. Peta asli dapat ditampilkan, tetapi posisi armada masih berupa simulasi dan belum berasal dari GPS driver.",
  },
];
