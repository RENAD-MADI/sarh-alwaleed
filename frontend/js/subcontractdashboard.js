const esc = DashboardCore.esc;

/**
 * Loads one page of sublease contracts and paints every table on the page.
 *
 * Attachments belong to the record being shown, so they are rendered from
 * `contracts[0]` -- the dashboards display one contract per page.
 */
async function loadPage(page) {
    const res = await axios.get(API.url(`/elbaten/page?page=${page}`));
    const contracts = res.data.data || [];
    const pagination = res.data.pagination || { totalPages: 1 };

    let out1 = '';
    let out2 = '';
    let out3 = '';
    let out4 = '';
    let out5 = '';
    let out6 = '';
    let out7 = '';
    let out8 = '';
    let out9 = '';
    let out10 = '';
    let out11 = '';
    if (contracts.length > 0) {
        DashboardCore.renderFiles(contracts[0].ownerImage, document.querySelector("#image"));
        DashboardCore.renderFiles(contracts[0].clientImage, document.querySelector("#image1"));
        DashboardCore.renderFiles(contracts[0].agentImage, document.querySelector("#image2"));
    } else {
        DashboardCore.renderFiles([], document.querySelector("#image"));
        DashboardCore.renderFiles([], document.querySelector("#image1"));
        DashboardCore.renderFiles([], document.querySelector("#image2"));
    }

    contracts.forEach((contract) => {
            out1 += `
                <tr>
                    <td>${esc(contract.contractMainNum)}</td>
                    <td>${esc(contract.contractNum)}</td>
                    <td>${esc(contract.contractType)}</td>
                    <td>${esc(contract.contractDateDay)}</td>
                    <td>${esc(contract.contractDateMonth)}</td>
                    <td>${esc(contract.contractDateYear)}</td>
                    <td>${esc(contract.contractPlace)}</td>
                    <td>${esc(contract.contractStartDateDay)}</td>
                    <td>${esc(contract.contractStartDateMonth)}</td>
                    <td>${esc(contract.contractStartDateYear)}</td>
                    <td>${esc(contract.contractEndDateDay)}</td>
                    <td>${esc(contract.contractEndDateMonth)}</td>
                    <td>${esc(contract.contractEndDateYear)}</td>
                </tr>`;

            out2 += `
                <tr>
                    <td>${esc(contract.ownerName)}</td>
                    <td>${esc(contract.ownerNationality)}</td>
                    <td>${esc(contract.ownerID)}</td>
                    <td>${esc(contract.ownerIdType)}</td>
                    <td>${esc(contract.ownerPhone)}</td>
                    <td>${esc(contract.ownerEmail)}</td>
                </tr>`;

            out3 += `
                <tr>
                    <td>${esc(contract.clientName)}</td>
                    <td>${esc(contract.clientNationality)}</td>
                    <td>${esc(contract.clientID)}</td>
                    <td>${esc(contract.clientIdType)}</td>
                    <td>${esc(contract.clientPhone)}</td>
                    <td>${esc(contract.clientEmail)}</td>
                </tr>`;
            out4 += `
                <tr>
                    <td>${esc(contract.facilityName)}</td>
                    <td>${esc(contract.facilityAddress)}</td>
                    <td>${esc(contract.facilityRecordNum)}</td>
                    <td>${esc(contract.facilityPhone)}</td>
                    <td>${esc(contract.agentName)}</td>
                    <td>${esc(contract.agentNationality)}</td>
                    <td>${esc(contract.agentID)}</td>
                    <td>${esc(contract.agentIdType)}</td>
                    <td>${esc(contract.agentPhone)}</td>
                    <td>${esc(contract.agentEmail)}</td>


                </tr>`;

            out5 += `
                <tr>
                    <td>${esc(contract.sakNumber)}</td>
                    <td>${esc(contract.sakIssuer)}</td>
                    <td>${esc(contract.sakDateDay)}</td>
                    <td>${esc(contract.sakDateMonth)}</td>
                    <td>${esc(contract.sakDateYear)}</td>
                    <td>${esc(contract.sakAddress)}</td>


                </tr>`;
                
            out6 += `
                <tr>
                    <td>${esc(contract.buildingAdress)}</td>
                    <td>${esc(contract.buildingType)}</td>
                    <td>${esc(contract.buildingUsage)}</td>
                    <td>${esc(contract.buildingFloorNum)}</td>
                    <td>${esc(contract.buildingUnitsNum)}</td>
                    <td>${esc(contract.buildingElevatorNum)}</td>
                    <td>${esc(contract.buildingMawaqefNum)}</td>
                </tr>`;
                
            out7 += `
                <tr>
                    <td>${esc(contract.unitNum)}</td>
                    <td>${esc(contract.unitType)}</td>
                    <td>${esc(contract.unitOwner)}</td>
                    <td>${esc(contract.unitFloorNum)}</td>
                    <td>${esc(contract.unitFurnishingcon)}</td>
                    <td>${esc(contract.unitKitchenCabinets)}</td>
                    <td>${esc(contract.unitRoomType)}</td>
                    <td>${esc(contract.unitRoomNum)}</td>
                </tr>`;
                
            out8 += `
                <tr>
                    <td>${esc(contract.unitACType)}</td>
                    <td>${esc(contract.unitACNum)}</td>
                    <td>${esc(contract.unitElecNum)}</td>
                    <td>${esc(contract.unitElecRead)}</td>
                    <td>${esc(contract.unitWaterNum)}</td>
                    <td>${esc(contract.unitWaterRead)}</td>
                    <td>${esc(contract.unitGasNum)}</td>
                    <td>${esc(contract.unitGasRead)}</td>
                </tr>`;
                out9 += `
                <tr>
                    <td>${esc(contract.effortPrice)}</td>
                    <td>${esc(contract.guaranteePrice)}</td>
                    <td>${esc(contract.elecMonthlyPrice)}</td>
                    <td>${esc(contract.gasMonthlyPrice)}</td>
                    <td>${esc(contract.waterMonthlyPrice)}</td>
                    <td>${esc(contract.mowafqMonthlyPrice)}</td>
                    <td>${esc(contract.MonthlyPrice)}</td>
                </tr>`;
                out10 += `
                <tr>
                    <td>${esc(contract.mawaqefRentNum)}</td>
                    <td>${esc(contract.periodicRentPayment)}</td>
                    <td>${esc(contract.rentPaymentCycle)}</td>
                    <td>${esc(contract.lastRentPayment)}</td>
                    <td>${esc(contract.rentCycleNum)}</td>
                    <td>${esc(contract.totalContract)}</td>
                </tr>`;
                out11 += `
                <tr>
                    <td>${esc(contract.serialNumber)}</td>
                    <td>${esc(contract.serialDateDay)}</td>
                    <td>${esc(contract.serialDateMonth)}</td>
                    <td>${esc(contract.serialDateYear)}</td>
                    <td>${esc(contract.serialDateEndDay)}</td>
                    <td>${esc(contract.serialDateEndMonth)}</td>
                    <td>${esc(contract.serialDateEndYear)}</td>
                    <td>${esc(contract.serialDateHJDay)}</td>
                    <td>${esc(contract.serialDateHJMonth)}</td>
                    <td>${esc(contract.serialDateHJYear)}</td>
                    <td>${esc(contract.serialDateEndHJDay)}</td>
                    <td>${esc(contract.serialDateEndHJMonth)}</td>
                    <td>${esc(contract.serialDateEndHJYear)}</td>
                    <td>${esc(contract.serialValue)}</td>

                </tr>`;
    });

    document.querySelector("#data1").innerHTML = out1;
    document.querySelector("#data2").innerHTML = out2;
    document.querySelector("#data3").innerHTML = out3;
    document.querySelector("#data4").innerHTML = out4;
    document.querySelector("#data5").innerHTML = out5;
    document.querySelector("#data6").innerHTML = out6;
    document.querySelector("#data7").innerHTML = out7;
    document.querySelector("#data8").innerHTML = out8;
    document.querySelector("#data9").innerHTML = out9;
    document.querySelector("#data10").innerHTML = out10;
    document.querySelector("#data11").innerHTML = out11;
    return { items: contracts, totalPages: pagination.totalPages };
}

DashboardCore.startDashboard(loadPage);
