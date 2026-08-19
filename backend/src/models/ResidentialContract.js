import mongoose from 'mongoose';
import fileSchema from './fileSubdoc.js';

const str = { type: String, trim: true, default: '' };

/**
 * Residential unified rental contract (العقد السكني الموحد).
 * Field names mirror the `name` attributes of the four-step form
 * (Residentialcontract.html -> contract2 -> contract3 -> contract4).
 */
const residentialContractSchema = new mongoose.Schema(
  {
    // --- Owner (المالك) ---
    ownerName: { type: String, trim: true, required: true },
    ownerID: { type: String, trim: true, required: true, index: true },
    dayBD: str,
    monthBD: str,
    yearBD: str,
    ownerPhone: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    bankName: str,
    IBAN: str,
    ownerBuildingNum: str,

    // --- National address / deed (العنوان الوطني والصك) ---
    postalCode: str,
    addCode: str,
    district: str,
    streetName: str,
    sakNumber: str,
    sakDay: str,
    sakMonth: str,
    sakYear: str,
    floorNum: str,
    aprtmentsNum: str,
    mawaqfNum: str,
    elevatorNum: str,
    buildingName: str,
    buildingDay: str,
    buildingMonth: str,
    buildingYear: str,

    // --- Owner's legal agent (الوكيل الشرعي للمالك) ---
    ownerAgencyNum: str,
    ownerAgencyDate: str,
    ownerAgentName: str,
    ownerAgencyPhone: str,
    ownerAgencyDay: str,
    ownerAgencyMonth: str,
    ownerAgencyYear: str,
    ownerAgencyEmail: str,

    // --- Tenant (المستأجر) ---
    clientName: { type: String, trim: true, required: true },
    clientPhone: { type: String, trim: true, required: true },
    clientIDNumber: { type: String, trim: true, required: true, index: true },
    clientEmail: { type: String, trim: true, lowercase: true, default: '' },
    clientDayBD: str,
    clientMonthBD: str,
    clientYearBD: str,
    clientDayBDHJ: str,
    clientMonthBDHJ: str,
    clientYearBDHJ: str,

    // --- Tenant's legal agent ---
    clientAgencyNum: str,
    clientAgencyDate: str,
    clientAgentName: str,
    clientAgencyPhone: str,
    clientAgencyDay: str,
    clientAgencyMonth: str,
    clientAgencyYear: str,
    clientAgencyEmail: str,

    // --- Rental unit (الوحدة الإيجارية) ---
    unitNum: str,
    unitFloor: str,
    unitBedRooms: str,
    unitSeats: str,
    unitHalls: str,
    unitMaidRooms: str,
    unitStoreNum: str,
    unitKitchenNum: str,
    unitBathroomNum: str,
    unitYardNum: str,
    unitTypeQ: str,
    unitTypeOther: str,
    unitFornitureQ: str,
    unitKitchenDrawerQ: str,
    unitACQ: str,
    unitACNormalNum: str,
    unitACCnetralNum: str,
    unitSplitNum: str,
    unitWindowNum: str,
    unitElecNum: str,
    unitElecRead: str,
    unitWaterNum: str,
    unitWaterRead: str,
    unitGasNum: str,
    unitGasRead: str,

    // --- Financial terms (الشروط المالية) ---
    unitPrice: str,
    unitInsurance: str,
    unitDay: str,
    unitMonth: str,
    unitYear: str,
    unitPayment: str,
    unitContract: str,
    unitAutoRenewal: str,
    unitNotes: str,

    // --- Attachments (المرفقات) ---
    ownerImage: { type: [fileSchema], default: [] },
    clientImage: { type: [fileSchema], default: [] },
    sakImage: { type: [fileSchema], default: [] },
    familyImages: { type: [fileSchema], default: [] },
    agencyImage: { type: [fileSchema], default: [] },
    agentImage: { type: [fileSchema], default: [] },

    status: {
      type: String,
      enum: ['pending', 'in_review', 'issued', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true, collection: 'residential_contracts' }
);

// Dashboards page through newest-first; this index backs that sort.
residentialContractSchema.index({ createdAt: -1 });

export default mongoose.model('ResidentialContract', residentialContractSchema);
