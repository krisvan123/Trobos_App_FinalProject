export type TripStatus =
  | 'IDLE'
  | 'REQUESTED'
  | 'SEARCHING_TANDEM' // alias SEARCHING_RESCUE
  | 'TANDEM_ASSIGNED'  // alias RESCUE_ASSIGNED
  | 'TANDEM_APPROACHING' // alias RESCUE_APPROACHING
  | 'TANDEM_ARRIVED'  // alias RESCUE_ARRIVED
  | 'VERIFICATION'
  | 'VEHICLE_HANDOVER'
  | 'TRIP_STARTED'
  | 'USER_ARRIVED'
  | 'VEHICLE_ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type ServiceType = 'TANDEM' | 'MECHANIC';

export type PaymentMethod = 'GOPAY' | 'OVO' | 'QRIS' | 'CARD' | 'CASH';

export interface LocationPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
  areaTag?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rating: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  fuelLevel: number; // 0 - 100 percentage
  stnkVerified: boolean;
  type: 'Sedan' | 'SUV' | 'Hatchback' | 'MPV';
  transmission: 'Automatic' | 'Manual';
}

export type BreakdownProblemId =
  | 'engine_failure'
  | 'flat_tire'
  | 'battery_dead'
  | 'overheat'
  | 'starter_failure'
  | 'minor_accident'
  | 'unknown';

export interface BreakdownProblem {
  id: BreakdownProblemId;
  label: string;
  description: string;
  iconName: string;
  severity: 'high' | 'medium' | 'low';
}

export type PassengerTransportType = 'MOTOR' | 'CAR' | 'VAN';

export interface PassengerTransportOption {
  type: PassengerTransportType;
  title: string;
  capacityLabel: string;
  description: string;
  recommendedFor: string;
  vehicleModel: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  plate: string;
}

export interface TowingUnit {
  operatorName: string;
  operatorPhone: string;
  operatorRating: number;
  truckModel: string;
  plate: string;
  type: 'Truk Towing Gendong Flatbed' | 'Derek Hidrolik';
}

export interface Rider {
  id: string;
  name: string;
  rating: number;
  tripsCount: number;
  phone: string;
  avatar: string;
  bikeModel: string;
  plate: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  tripsCount: number;
  phone: string;
  avatar: string;
  licenseNumber: string;
  safetyBadge: string;
  badgeType: 'Gold Master' | 'Defensive Certified' | 'Senior Pilot';
}

export interface TandemUnit {
  rider: Rider;
  driver: Driver;
  towing?: TowingUnit;
}

export interface FareBreakdown {
  baseFare: number;
  emergencyService: number; // layanan rescue / tandem darurat
  distanceFare: number;
  towingFare: number;
  surgeFare: number;
  totalFare: number;
  distanceKm: number;
  estimatedPassengerMinutes: number;
  estimatedTowingMinutes: number;
}

export interface HandoverChecklist {
  front: boolean;
  rear: boolean;
  left: boolean;
  right: boolean;
  interior: boolean;
  fuelRecorded: number;
  problemConfirmed: boolean;
  confirmed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'rider' | 'driver' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ActiveTrip {
  id: string;
  status: TripStatus;
  serviceType: ServiceType;
  paymentMethod: PaymentMethod;
  origin: LocationPoint;
  destination: LocationPoint; // passenger destination
  carDestination: LocationPoint; // workshop or same destination
  carDestinationType: 'WORKSHOP' | 'SAME_AS_PASSENGER';
  problem: BreakdownProblem;
  passengerCount: number;
  passengerTransport: PassengerTransportOption;
  vehicle: Vehicle;
  tandem: TandemUnit | null;
  towingUnit: TowingUnit;
  fare: FareBreakdown;
  otpCode: string;
  handover: HandoverChecklist;
  userProgressPercent: number; // 0 to 100
  carProgressPercent: number;  // 0 to 100
  userEtaMinutes: number;
  carEtaMinutes: number;
  damagePhotoUrl?: string | null;
  damagePhotoNote?: string;
  rating?: number;
  feedbackTags?: string[];
  createdAt: string;
}

export interface TripHistoryItem {
  id: string;
  date: string;
  serviceType?: ServiceType;
  paymentMethod?: PaymentMethod;
  origin: string;
  destination: string;
  carDestination: string;
  problemLabel: string;
  passengerCount: number;
  passengerTransportType: PassengerTransportType;
  fare: number;
  distanceKm: number;
  status: 'Completed' | 'Cancelled';
  vehiclePlate: string;
  riderName: string;
  driverName: string;
  rating: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
}
