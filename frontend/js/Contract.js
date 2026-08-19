const esc = DashboardCore.esc;

/**
 * Loads one page of residential contracts and paints every table on the page.
 *
 * Attachments belong to the record being shown, so they are rendered from
 * `contracts[0]` -- the dashboards display one contract per page.
 */
async function loadPage(page) {
    const res = await axios.get(API.url(`/realEsate/page?page=${page}`));
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
    if (contracts.length > 0) {
        DashboardCore.renderFiles(contracts[0].ownerImage, document.querySelector("#image"));
        DashboardCore.renderFiles(contracts[0].clientImage, document.querySelector("#image1"));
        DashboardCore.renderFiles(contracts[0].sakImage, document.querySelector("#image2"));
        DashboardCore.renderFiles(contracts[0].familyImages, document.querySelector("#image3"));
        DashboardCore.renderFiles(contracts[0].agencyImage, document.querySelector("#image4"));
        DashboardCore.renderFiles(contracts[0].agentImage, document.querySelector("#image5"));
    } else {
        DashboardCore.renderFiles([], document.querySelector("#image"));
        DashboardCore.renderFiles([], document.querySelector("#image1"));
        DashboardCore.renderFiles([], document.querySelector("#image2"));
        DashboardCore.renderFiles([], document.querySelector("#image3"));
        DashboardCore.renderFiles([], document.querySelector("#image4"));
        DashboardCore.renderFiles([], document.querySelector("#image5"));
    }

    contracts.forEach((contract) => {
            out1 += `
                <tr>
                    <td>${esc(contract.ownerName)}</td>
                    <td>${esc(contract.ownerID)}</td>
                    <td>${esc(contract.dayBD)}</td>
                    <td>${esc(contract.monthBD)}</td>
                    <td>${esc(contract.yearBD)}</td>
                    <td>${esc(contract.ownerPhone)}</td>
                    <td>${esc(contract.email)}</td>
                    <td>${esc(contract.bankName)}</td>
                    <td>${esc(contract.IBAN)}</td>
                    <td>${esc(contract.ownerBuildingNum)}</td>
                </tr>`;

            out2 += `
                <tr>
                    <td>${esc(contract.postalCode)}</td>
                    <td>${esc(contract.addCode)}</td>
                    <td>${esc(contract.district)}</td>
                    <td>${esc(contract.streetName)}</td>
                    <td>${esc(contract.sakNumber)}</td>
                    <td>${esc(contract.sakDay)}</td>
                    <td>${esc(contract.sakMonth)}</td>
                    <td>${esc(contract.sakYear)}</td>
                    <td>${esc(contract.floorNum)}</td>
                    <td>${esc(contract.aprtmentsNum)}</td>
                </tr>`;

            out3 += `
                <tr>
                    <td>${esc(contract.mawaqfNum)}</td>
                    <td>${esc(contract.elevatorNum)}</td>
                    <td>${esc(contract.buildingName)}</td>
                    <td>${esc(contract.buildingDay)}</td>
                    <td>${esc(contract.buildingMonth)}</td>
                    <td>${esc(contract.buildingYear)}</td>
                </tr>`;
            out4 += `
                <tr>
                    <td>${esc(contract.ownerAgencyNum)}</td>
                    <td>${esc(contract.ownerAgencyDate)}</td>
                    <td>${esc(contract.ownerAgentName)}</td>
                    <td>${esc(contract.ownerAgencyPhone)}</td>
                    <td>${esc(contract.ownerAgencyDay)}</td>
                    <td>${esc(contract.ownerAgencyMonth)}</td>
                    <td>${esc(contract.ownerAgencyYear)}</td>
                    <td>${esc(contract.ownerAgencyEmail)}</td>
                </tr>`;

            out5 += `
                <tr>
                    <td>${esc(contract.clientName)}</td>
                    <td>${esc(contract.clientPhone)}</td>
                    <td>${esc(contract.clientIDNumber)}</td>
                    <td>${esc(contract.clientEmail)}</td>
                    <td>${esc(contract.clientDayBD)}</td>
                    <td>${esc(contract.clientMonthBD)}</td>
                    <td>${esc(contract.clientYearBD)}</td>
                    <td>${esc(contract.clientDayBDHJ)}</td>
                    <td>${esc(contract.clientMonthBDHJ)}</td>
                    <td>${esc(contract.clientYearBDHJ)}</td>
                </tr>`;
                
            out6 += `
                <tr>
                    <td>${esc(contract.unitNum)}</td>
                    <td>${esc(contract.unitFloor)}</td>
                    <td>${esc(contract.unitBedRooms)}</td>
                    <td>${esc(contract.unitSeats)}</td>
                    <td>${esc(contract.unitHalls)}</td>
                    <td>${esc(contract.unitMaidRooms)}</td>
                    <td>${esc(contract.unitStoreNum)}</td>
                    <td>${esc(contract.unitKitchenNum)}</td>
                    <td>${esc(contract.unitBathroomNum)}</td>
                    <td>${esc(contract.unitYardNum)}</td>
                    <td>${esc(contract.unitTypeQ)}</td>
                    <td>${esc(contract.unitTypeOther)}</td>
                </tr>`;
                
            out7 += `
                <tr>
                    <td>${esc(contract.unitFornitureQ)}</td>
                    <td>${esc(contract.unitKitchenDrawerQ)}</td>
                    <td>${esc(contract.unitACQ)}</td>
                    <td>${esc(contract.unitACNormalNum)}</td>
                    <td>${esc(contract.unitACCnetralNum)}</td>
                    <td>${esc(contract.unitSplitNum)}</td>
                    <td>${esc(contract.unitWindowNum)}</td>
                    <td>${esc(contract.unitElecNum)}</td>
                    <td>${esc(contract.unitElecRead)}</td>
                    <td>${esc(contract.unitWaterNum)}</td>
                    <td>${esc(contract.unitWaterRead)}</td>
                </tr>`;
                
            out8 += `
                <tr>
                    <td>${esc(contract.unitGasNum)}</td>
                    <td>${esc(contract.unitGasRead)}</td>
                    <td>${esc(contract.unitPrice)}</td>
                    <td>${esc(contract.unitInsurance)}</td>
                    <td>${esc(contract.unitDay)}</td>
                    <td>${esc(contract.unitMonth)}</td>
                    <td>${esc(contract.unitYear)}</td>
                    <td>${esc(contract.unitPayment)}</td>
                    <td>${esc(contract.unitContract)}</td>
                    <td>${esc(contract.unitAutoRenewal)}</td>
                    <td>${esc(contract.unitNotes)}</td>
                </tr>`;
                out9 += `
                <tr>
                    <td>${esc(contract.clientAgencyNum)}</td>
                    <td>${esc(contract.clientAgencyDate)}</td>
                    <td>${esc(contract.clientAgentName)}</td>
                    <td>${esc(contract.clientAgencyPhone)}</td>
                    <td>${esc(contract.clientAgencyDay)}</td>
                    <td>${esc(contract.clientAgencyMonth)}</td>
                    <td>${esc(contract.clientAgencyYear)}</td>
                    <td>${esc(contract.clientAgencyEmail)}</td>
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
    return { items: contracts, totalPages: pagination.totalPages };
}

DashboardCore.startDashboard(loadPage);
