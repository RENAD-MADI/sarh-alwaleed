import mongoose from 'mongoose';
import fileSchema from './fileSubdoc.js';

const str = { type: String, trim: true, default: '' };

/**
 * Commercial unified rental contract (العقد التجاري الموحد).
 * Field names mirror the six-step form (Commercialcontract.html -> commerical6.html).
 */
const commercialContractSchema = new mongoose.Schema(
  {
    // --- Owner (المالك) ---
    ownerID: { type: String, trim: true, required: true, index: true },
    ownerDateDay: str,
    ownerDateMonth: str,
    ownerDateYear: str,
    ownerPhone: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    bankName: str,
    IBAN: str,
    ownerBuildingNum: str,
    ownerPostalCode: str,
    ownerAddCode: str,
    ownerDistrict: str,
    ownerStreetName: str,

    // --- Building (المبنى) ---
    BuildingNum: str,
    buildingPostalCode: str,
    buildingAddCode: str,
    buildingDistrict: str,
    buildingStreetName: str,
    buildingFloorsNum: str,
    buildingRentalUnitNum: str,
    buildingSakNum: str,
    buildingSakDay: str,
    buildingSakMonth: str,
    buildingSakYear: str,
    buildingType: str,
    buildingUsage: str,
    buildingMwaqefNum: str,
    buildingName: str,
    buildingDay: str,
    buildingMonth: str,
    buildingYear: str,

    // --- Owner's legal agent ---
    ownerAgencyNum: str,
    ownerAgencyDate: str,
    ownerAgentName: str,
    ownerAgencyPhone: str,
    ownerAgencyDay: str,
    ownerAgencyMonth: str,
    ownerAgencyYear: str,
    ownerAgencyEmail: str,

    // --- Commercial registration (السجل التجاري) ---
    commercialName: str,
    commercialNumber: { type: String, trim: true, default: '', index: true },
    commercialExpireDateDay: str,
    commercialExpireDateMonth: str,
    commercialExpireDateYear: str,
    commercialBuildingNum: str,
    commercialbuildingAddCode: str,
    commercialbuildingPostalCode: str,
    commercialbuildingDistrict: str,
    commercialbuildingStreetName: str,

    // --- Tenant (المستأجر) ---
    commercialClientID: { type: String, trim: true, required: true, index: true },
    commercialClientDayHJ: str,
    commercialClientMonthHJ: str,
    commercialClientYearHJ: str,
    commercialClientDay: str,
    commercialClientMonth: str,
    commercialClientYear: str,
    commercialClientPhone: { type: String, trim: true, required: true },
    commercialClientEmail: { type: String, trim: true, lowercase: true, default: '' },

    // --- Tenant's legal agent ---
    clientAgencyNum: str,
    clientAgencyDateDay: str,
    clientAgencyDateMonth: str,
    clientAgencyDateYear: str,
    clientAgencyPhone: str,
    clientAgentID: str,
    clientAgencyDay: str,
    clientAgencyMonth: str,
    clientAgencyYear: str,
    clientAgencyEmail: str,

    // --- Facility and unit (المنشأة والوحدة) ---
    facilityNum: str,
    facilityName: str,
    unitNum: str,
    unitType: str,
    unitLocation: str,
    unitArea: str,
    unitFrontFace: str,
    unitFrontFaceDirection: str,
    unitFloorNum: str,
    unitMezzanine: str,
    unitFinishing: str,
    unitAdvertisingLength: str,
    unitAdvertisingWidth: str,
    unitAdvertisingLocation: str,
    unitACQ: str,
    unitACNormalNum: str,
    unitACCnetralNum: str,
    unitSplitNum: str,
    unitWindowNum: str,
    unitKitchenDrawerQ: str,
    unitFornitureQ: str,
    unitElecNum: str,
    unitElecRead: str,
    unitWaterNum: str,
    unitWaterRead: str,
    unitPublicServices: str,
    unitPublicPrice: str,

    // --- Financial terms ---
    unitPrice: str,
    unitInsurance: str,
    unitPaymentType: str,
    unitContractPeriod: str,
    unitDay: str,
    unitMonth: str,
    unitYear: str,
    unitNotes: str,

    // --- Permissions (الأذونات) ---
    permissionQ1Answer: str,
    permissionQ2Answer: str,
    permissionQ3Answer: str,
    permissionQ4Answer: str,
    permissionQ5Answer: str,
    permissionQ6Answer: str,
    permissionQ7Answer: str,

    // --- Obligations, split between the two parties (الالتزامات) ---
    commitmentQ1Answer1: str,
    commitmentQ1Answer2: str,
    commitmentQ2Answer1: str,
    commitmentQ2Answer2: str,
    commitmentQ3Answer1: str,
    commitmentQ3Answer2: str,
    commitmentQ4Answer1: str,
    commitmentQ4Answer2: str,

    // --- Additional obligations (التزامات إضافية) ---
    addcommitmentQ1: str,
    addcommitmentQ3: str,
    addcommitmentQ4: str,
    addcommitmentQ5: str,
    addcommitmentQ6: str,
    addcommitmentQ7: str,
    addcommitmentQ8: str,
    addcommitmentQ9: str,
    addcommitmentQ10: str,
    addcommitmentQ11: str,
    addcommitmentQ12: str,
    addcommitmentQ13: str,
    addcommitmentQ14: str,
    addcommitmentQ15: str,
    addcommitmentQ16: str,
    addcommitmentQ17: str,
    addcommitmentQ18: str,
    addcommitmentQ19: str,
    addcommitmentQ20: str,

    // --- Attachments ---
    ownerImage: { type: [fileSchema], default: [] },
    clientImage: { type: [fileSchema], default: [] },
    sakImage: { type: [fileSchema], default: [] },
    commercialImage: { type: [fileSchema], default: [] },
    agencyImage: { type: [fileSchema], default: [] },
    agentImage: { type: [fileSchema], default: [] },

    status: {
      type: String,
      enum: ['pending', 'in_review', 'issued', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true, collection: 'commercial_contracts' }
);

commercialContractSchema.index({ createdAt: -1 });

export default mongoose.model('CommercialContract', commercialContractSchema);
