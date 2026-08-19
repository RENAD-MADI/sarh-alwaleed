import mongoose from 'mongoose';
import fileSchema from './fileSubdoc.js';

const str = { type: String, trim: true, default: '' };

/**
 * Sublease unified rental contract (عقد الإيجار الموحد بالباطن).
 * Field names mirror the five-step form (subcontract.html -> subcontract4.html).
 * Stored under the legacy route prefix `/elbaten` that the frontend calls.
 */
const subContractSchema = new mongoose.Schema(
  {
    // --- Contract header (بيانات العقد) ---
    contractMainNum: str,
    contractNum: { type: String, trim: true, default: '', index: true },
    contractType: str,
    contractDateDay: str,
    contractDateMonth: str,
    contractDateYear: str,
    contractPlace: str,
    contractStartDateDay: str,
    contractStartDateMonth: str,
    contractStartDateYear: str,
    contractEndDateDay: str,
    contractEndDateMonth: str,
    contractEndDateYear: str,

    // --- Owner (المؤجر) ---
    ownerName: { type: String, trim: true, required: true },
    ownerNationality: str,
    ownerID: { type: String, trim: true, required: true, index: true },
    ownerIdType: str,
    ownerPhone: { type: String, trim: true, required: true },
    ownerEmail: { type: String, trim: true, lowercase: true, default: '' },

    // --- Tenant (المستأجر) ---
    clientName: { type: String, trim: true, required: true },
    clientNationality: str,
    clientID: { type: String, trim: true, required: true, index: true },
    clientIdType: str,
    clientPhone: { type: String, trim: true, required: true },
    clientEmail: { type: String, trim: true, lowercase: true, default: '' },

    // --- Facility (المنشأة) ---
    facilityName: str,
    facilityAddress: str,
    facilityRecordNum: str,
    facilityPhone: str,

    // --- Agent (الوكيل) ---
    agentName: str,
    agentNationality: str,
    agentID: str,
    agentIdType: str,
    agentPhone: str,
    agentEmail: str,

    // --- Deed (الصك) ---
    sakNumber: str,
    sakIssuer: str,
    sakDateDay: str,
    sakDateMonth: str,
    sakDateYear: str,
    sakAddress: str,

    // --- Building (المبنى) ---
    buildingAdress: str,
    buildingType: str,
    buildingUsage: str,
    buildingFloorNum: str,
    buildingUnitsNum: str,
    buildingElevatorNum: str,
    buildingMawaqefNum: str,

    // --- Unit (الوحدة) ---
    unitNum: str,
    unitType: str,
    unitOwner: str,
    unitFloorNum: str,
    unitFurnishingcon: str,
    unitKitchenCabinets: str,
    unitRoomType: str,
    unitRoomNum: str,
    unitACType: str,
    unitACNum: str,
    unitElecNum: str,
    unitElecRead: str,
    unitWaterNum: str,
    unitWaterRead: str,
    unitGasNum: str,
    unitGasRead: str,

    // --- Financial terms (الشروط المالية) ---
    effortPrice: str,
    guaranteePrice: str,
    elecMonthlyPrice: str,
    gasMonthlyPrice: str,
    waterMonthlyPrice: str,
    mowafqMonthlyPrice: str,
    MonthlyPrice: str,
    mawaqefRentNum: str,
    periodicRentPayment: str,
    rentPaymentCycle: str,
    lastRentPayment: str,
    rentCycleNum: str,
    totalContract: str,

    // --- Payment instruments (السندات) ---
    serialNumber: str,
    serialDateDay: str,
    serialDateMonth: str,
    serialDateYear: str,
    serialDateEndDay: str,
    serialDateEndMonth: str,
    serialDateEndYear: str,
    serialDateHJDay: str,
    serialDateHJMonth: str,
    serialDateHJYear: str,
    serialDateEndHJDay: str,
    serialDateEndHJMonth: str,
    serialDateEndHJYear: str,
    serialValue: str,

    // --- Attachments ---
    ownerImage: { type: [fileSchema], default: [] },
    clientImage: { type: [fileSchema], default: [] },
    agentImage: { type: [fileSchema], default: [] },

    status: {
      type: String,
      enum: ['pending', 'in_review', 'issued', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true, collection: 'sub_contracts' }
);

subContractSchema.index({ createdAt: -1 });

export default mongoose.model('SubContract', subContractSchema);
