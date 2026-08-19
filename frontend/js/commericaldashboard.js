const esc = DashboardCore.esc;

/**
 * Loads one page of commercial contracts and paints every table on the page.
 *
 * Attachments belong to the record being shown, so they are rendered from
 * `contracts[0]` -- the dashboards display one contract per page.
 */
async function loadPage(page) {
    const res = await axios.get(API.url(`/commercial/page?page=${page}`));
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
    let out12 = '';
    if (contracts.length > 0) {
        DashboardCore.renderFiles(contracts[0].ownerImage, document.querySelector("#image"));
        DashboardCore.renderFiles(contracts[0].clientImage, document.querySelector("#image1"));
        DashboardCore.renderFiles(contracts[0].sakImage, document.querySelector("#image2"));
        DashboardCore.renderFiles(contracts[0].commercialImage, document.querySelector("#image3"));
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
                    <td>${esc(contract.ownerID)}</td>
                    <td>${esc(contract.ownerDateDay)}</td>
                    <td>${esc(contract.ownerDateMonth)}</td>
                    <td>${esc(contract.ownerDateYear)}</td>
                    <td>${esc(contract.ownerPhone)}</td>
                    <td>${esc(contract.email)}</td>
                    <td>${esc(contract.bankName)}</td>
                    <td>${esc(contract.IBAN)}</td>
                    <td>${esc(contract.ownerBuildingNum)}</td>
                    <td>${esc(contract.ownerPostalCode)}</td>
                    <td>${esc(contract.ownerAddCode)}</td>
                    <td>${esc(contract.ownerDistrict)}</td>
                    <td>${esc(contract.ownerStreetName)}</td>
                </tr>`;
                out2 += `
                <tr>
                    <td>${esc(contract.BuildingNum)}</td>
                    <td>${esc(contract.buildingPostalCode)}</td>
                    <td>${esc(contract.buildingAddCode)}</td>
                    <td>${esc(contract.buildingDistrict)}</td>
                    <td>${esc(contract.buildingStreetName)}</td>
                    <td>${esc(contract.buildingFloorsNum)}</td>
                    <td>${esc(contract.buildingRentalUnitNum)}</td>
                    <td>${esc(contract.buildingSakNum)}</td>
                    <td>${esc(contract.buildingSakDay)}</td>
                    <td>${esc(contract.buildingSakMonth)}</td>
                    <td>${esc(contract.buildingSakYear)}</td>
                </tr>`;
                out3 += `
                <tr>
                    <td>${esc(contract.buildingType)}</td>
                    <td>${esc(contract.buildingUsage)}</td>
                    <td>${esc(contract.buildingMwaqefNum)}</td>
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
                    <td>${esc(contract.commercialName)}</td>
                    <td>${esc(contract.commercialNumber)}</td>
                    <td>${esc(contract.commercialExpireDateDay)}</td>
                    <td>${esc(contract.commercialExpireDateMonth)}</td>
                    <td>${esc(contract.commercialExpireDateYear)}</td>
                    <td>${esc(contract.commercialBuildingNum)}</td>
                    <td>${esc(contract.commercialbuildingAddCode)}</td>
                    <td>${esc(contract.commercialbuildingPostalCode)}</td>
                    <td>${esc(contract.commercialbuildingDistrict)}</td>
                    <td>${esc(contract.commercialbuildingStreetName)}</td>
                </tr>`;
                out6 += `
                <tr>
                    <td>${esc(contract.commercialClientID)}</td>
                    <td>${esc(contract.commercialClientDay)}</td>
                    <td>${esc(contract.commercialClientMonth)}</td>
                    <td>${esc(contract.commercialClientYear)}</td>
                    <td>${esc(contract.commercialClientDayHJ)}</td>
                    <td>${esc(contract.commercialClientMonthHJ)}</td>
                    <td>${esc(contract.commercialClientYearHJ)}</td> 
                    <td>${esc(contract.commercialClientEmail)}</td>
                    <td>${esc(contract.commercialClientPhone)}</td>
                </tr>`;
                out7 += `
                <tr>
                    <td>${esc(contract.clientAgencyNum)}</td>
                    <td>${esc(contract.clientAgencyDateDay)}</td>
                    <td>${esc(contract.clientAgencyDateMonth)}</td>
                    <td>${esc(contract.clientAgencyDateYear)}</td>
                    <td>${esc(contract.clientAgencyPhone)}</td>
                    <td>${esc(contract.clientAgentID)}</td>
                    <td>${esc(contract.clientAgencyDay)}</td>
                    <td>${esc(contract.clientAgencyMonth)}</td> 
                    <td>${esc(contract.clientAgencyYear)}</td>
                    <td>${esc(contract.clientAgencyEmail)}</td>
                </tr>`;
                out8 += `
                <tr>
                    <td>${esc(contract.facilityNum)}</td>
                    <td>${esc(contract.facilityName)}</td>
                </tr>`;
                out9 += `
                <tr>
                    <td>${esc(contract.unitNum)}</td>
                    <td>${esc(contract.unitType)}</td>
                    <td>${esc(contract.unitLocation)}</td>
                    <td>${esc(contract.unitArea)}</td>
                    <td>${esc(contract.unitFrontFace)}</td>
                    <td>${esc(contract.unitFrontFaceDirection)}</td>
                    <td>${esc(contract.unitFloorNum)}</td>
                    <td>${esc(contract.unitMezzanine)}</td> 
                    <td>${esc(contract.unitFinishing)}</td>
                </tr>`;
                out10 += `
                <tr>
                    <td>${esc(contract.unitAdvertisingLength)}</td>
                    <td>${esc(contract.unitAdvertisingWidth)}</td>
                    <td>${esc(contract.unitAdvertisingLocation)}</td>
                    <td>${esc(contract.unitACQ)}</td>
                    <td>${esc(contract.unitACNormalNum)}</td>
                    <td>${esc(contract.unitACCnetralNum)}</td>
                    <td>${esc(contract.unitSplitNum)}</td>
                    <td>${esc(contract.unitWindowNum)}</td> 
                </tr>`;
                out11 += `
                <tr>
                    <td>${esc(contract.unitKitchenDrawerQ)}</td>
                    <td>${esc(contract.unitFornitureQ)}</td>
                    <td>${esc(contract.unitElecNum)}</td>
                    <td>${esc(contract.unitElecRead)}</td>
                    <td>${esc(contract.unitWaterNum)}</td>
                    <td>${esc(contract.unitWaterRead)}</td>
                    <td>${esc(contract.unitPublicServices)}</td>
                    <td>${esc(contract.unitPublicPrice)}</td>
                </tr>`;
                out12 += `
                <tr>
                    <td>${esc(contract.unitPrice)}</td>
                    <td>${esc(contract.unitInsurance)}</td>
                    <td>${esc(contract.unitPaymentType)}</td>
                    <td>${esc(contract.unitContractPeriod)}</td>
                    <td>${esc(contract.unitDay)}</td>
                    <td>${esc(contract.unitMonth)}</td>
                    <td>${esc(contract.unitYear)}</td>
                    <td>${esc(contract.unitNotes)}</td>
                </tr>`;
                let q1=document.getElementById('q1')
                let q2=document.getElementById('q2')
                let q3=document.getElementById('q3')
                let q4=document.getElementById('q4')
                let q5=document.getElementById('q5')
                let q6=document.getElementById('q6')
                let q7=document.getElementById('q7')
                let q8=document.getElementById('q8')
                let q9=document.getElementById('q9')
                let q10=document.getElementById('q10')
                let q11=document.getElementById('q11')
                let q12=document.getElementById('q12')
                let q13=document.getElementById('q13')
                let q14=document.getElementById('q14')
                let q15=document.getElementById('q15')
                let q16=document.getElementById('q16')

                let Q1=document.getElementById('Q1')
                let Q2=document.getElementById('Q2')
                let Q3=document.getElementById('Q3')
                let Q4=document.getElementById('Q4')
                let Q5=document.getElementById('Q5')
                let Q6=document.getElementById('Q6')
                let Q7=document.getElementById('Q7')
                let Q8=document.getElementById('Q8')
                let Q9=document.getElementById('Q9')
                let Q10=document.getElementById('Q10')
                let Q11=document.getElementById('Q11')
                let Q12=document.getElementById('Q12')
                let Q13=document.getElementById('Q13')
                let Q14=document.getElementById('Q14')
                let Q15=document.getElementById('Q15')
                let Q16=document.getElementById('Q16')
                let Q17=document.getElementById('Q17')
                let Q18=document.getElementById('Q18')
                let Q19=document.getElementById('Q19')
                let Q20=document.getElementById('Q20')


                q1.innerHTML=`${esc(contract.permissionQ1Answer)}`
                q2.innerHTML=`${esc(contract.permissionQ2Answer)}`
                q3.innerHTML=`${esc(contract.permissionQ3Answer)}`
                q4.innerHTML=`${esc(contract.permissionQ4Answer)}`
                q5.innerHTML=`${esc(contract.permissionQ5Answer)}`
                q6.innerHTML=`${esc(contract.permissionQ6Answer)}`
                q7.innerHTML=`${esc(contract.permissionQ7Answer)}`
                q8.innerHTML=`${esc(contract.permissionQ8Answer)}`
                q9.innerHTML=`${esc(contract.commitmentQ1Answer1)}`
                q10.innerHTML=`${esc(contract.commitmentQ1Answer2)}`
                q11.innerHTML=`${esc(contract.commitmentQ2Answer1)}`
                q12.innerHTML=`${esc(contract.commitmentQ2Answer2)}`
                q13.innerHTML=`${esc(contract.commitmentQ3Answer1)}`
                q14.innerHTML=`${esc(contract.commitmentQ3Answer2)}`
                q15.innerHTML=`${esc(contract.commitmentQ4Answer1)}`
                q16.innerHTML=`${esc(contract.commitmentQ4Answer2)}`



                Q1.innerHTML=`${esc(contract.addcommitmentQ1)}`
                Q2.innerHTML=`${esc(contract.addcommitmentQ2)}`
                Q3.innerHTML=`${esc(contract.addcommitmentQ3)}`
                Q4.innerHTML=`${esc(contract.addcommitmentQ4)}`
                Q5.innerHTML=`${esc(contract.addcommitmentQ5)}`
                Q6.innerHTML=`${esc(contract.addcommitmentQ6)}`
                Q7.innerHTML=`${esc(contract.addcommitmentQ7)}`
                Q8.innerHTML=`${esc(contract.addcommitmentQ8)}`
                Q9.innerHTML=`${esc(contract.addcommitmentQ9)}`
                Q10.innerHTML=`${esc(contract.addcommitmentQ10)}`
                Q11.innerHTML=`${esc(contract.addcommitmentQ11)}`
                Q12.innerHTML=`${esc(contract.addcommitmentQ12)}`
                Q13.innerHTML=`${esc(contract.addcommitmentQ13)}`
                Q14.innerHTML=`${esc(contract.addcommitmentQ14)}`
                Q15.innerHTML=`${esc(contract.addcommitmentQ15)}`
                Q16.innerHTML=`${esc(contract.addcommitmentQ16)}`
                Q17.innerHTML=`${esc(contract.addcommitmentQ17)}`
                Q18.innerHTML=`${esc(contract.addcommitmentQ18)}`
                Q19.innerHTML=`${esc(contract.addcommitmentQ19)}`
                Q20.innerHTML=`${esc(contract.addcommitmentQ20)}`
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
    document.querySelector("#data12").innerHTML = out12;
    return { items: contracts, totalPages: pagination.totalPages };
}

DashboardCore.startDashboard(loadPage);
