//92003584
function scrape(startId, quantity=1) {
    const entries = [];
    let csvs = "";

    searchID(startId);

    function waitForElementToExist(getFunction, callback) {
        function checkForElement() {
            const html = getFunction();
            if (html) {
                callback(html); // Element found, invoke the callback
            } else {
                setTimeout(checkForElement, 10); // Continue checking
            }
        }
    
        checkForElement(); // Start checking
    }

    function searchID(id) {
        function combineChildInnerHTML(parentElement, combing="") {
            if (!parentElement) {
                return ''; // Return an empty string if the parent element is not found
            }
            
            const childElements = parentElement.children;
            let combinedInnerHTML = '';
            
            for (let i = 0; i < childElements.length; i++) {
                const childElement = childElements[i];
                combinedInnerHTML += combing + childElement.innerHTML;
            }
            
            if (combing === "") {
                return combinedInnerHTML;
            } else {
                return combinedInnerHTML.substring(1);
            }
        }
    
        function extractEmailFromElement(element) {
            let email = element.split("mailto:")[1]
            let end = email.indexOf('"')
            return email.substring(0, end);
        }
    
        function extractPhoneFromElement(element) {
            let phone = element.split("tel:")[1]
            let end = phone.indexOf('"')
            return phone.substring(0, end);
        }
        
        function goHome(then) {
            waitForElementToExist(
                ()=>document.getElementById("dnn_ctr1464_View_btnReturnToList"),
                (element)=>{
                    element.click()

                    waitForElementToExist(
                        ()=>document.getElementById("dnn_ctr1464_View_btnReturnToSearch"),
                        (element)=>{
                            element.click()

                            waitForElementToExist(
                                ()=>document.getElementById("dnn_ctr1464_View_txtLicenseNumber"),
                                (element)=>{
                                    then()
                                }
                            )
                        }
                    )
                }
            )
        }
    
        document.getElementById("dnn_ctr1464_View_txtLicenseNumber").value = id;
        document.getElementById("dnn_ctr1464_View_btnSearchLicNum").click();

        setTimeout(()=>{
            if (
                document.getElementById("dnn_ctr1464_View_pnlNoResults")
                &&  document.getElementById("dnn_ctr1464_View_pnlNoResults").children
                &&  document.getElementById("dnn_ctr1464_View_pnlNoResults").children.length
            ) {
                searchID(id + 1);
                return;
            }

            waitForElementToExist(
                ()=>document.getElementById("dnn_ctr1464_View_rgSearchResults_ctl00__0"),
                (html)=>{
                    html.children[0].children[0].click()
        
                    waitForElementToExist(
                        ()=>document.getElementById("dnn_ctr1464_View_FacilityDetail_Accordion1"),
                        (html)=>{
                            const entry = {};
                            const csv = [];
                            const head = [];
        
                            html = html.getElementsByClassName("row border-bottom")
        
                            for (let i = 0; i <= 8; i++) {
                                const tit = html[i]
                                    .children[0]
                                    .innerHTML
                                    .replace('<span class="ml-4"></span>', "")
                                    .replace(":", "");
        
                                if (i === 3) {
                                    var val = combineChildInnerHTML(html[i].children[1]);
                                    val = extractEmailFromElement(val);
                                } else if (i === 2) {
                                    var val = combineChildInnerHTML(html[i].children[1], " ");
                                } else if (i === 6) {
                                    var val = combineChildInnerHTML(html[i].children[1]);
                                    val = extractPhoneFromElement(val);
                                } else if (i === 7) {
                                    //no one cares about fax
                                    continue;
                                } else {
                                    var val = combineChildInnerHTML(html[i].children[1]);
                                }
        
                                entry[tit] = val;
                                head.push(tit);
                                csv.push(val);
                            }

                            csvs = csvs.concat(csv.join(","))//.replace("undefined", "");
                            entries.push(entry);

                            console.log(head.join(","))
                            //console.log(JSON.stringify(entries));
                            console.log(csvs)

                            goHome();
    
                            waitForElementToExist(
                                ()=>document.getElementById("dnn_ctr1464_View_txtLicenseNumber"),
                                ()=>{
                                    if (quantity <= entries.length) {
                                        return;
                                    } else {
                                        searchID(id + 1)
                                    }
                                },
                            );
                        }
                    )
                }
            )
        }, 1000);
    }
}

scrape(10000056, 10)

// [{"License Number":"10000056","Facility Name":"CUDDLE BEARS CHILD CARE, INC","Address":"948 SABBATH HOME ROAD SW  SUPPLY NC 28462  Brunswick","Email":"melissa-wilson@live.com","Website":"","Facility/Program Type":"Child Care Center","Phone":"9108428162","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000073","Facility Name":"EARTH ANGELS EDUCATIONAL CENTER","Address":"720 WHITEVILLE ROAD NW  SHALLOTTE NC 28470  Brunswick","Email":"thevillagecampus@gmail.com","Website":"","Facility/Program Type":"Child Care Center","Phone":"9107542072","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000093","Facility Name":"CHILDCARE NETWORK #84","Address":"787 VIILLAGE ROAD  LELAND NC 28451  Brunswick","Email":"cni84@childcarenetwork.com","Website":"www.childcarenetwork.net","Facility/Program Type":"Child Care Center","Phone":"9103833066","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000099","Facility Name":"LITTLE  ANGELS","Address":"5390 PALMERS BRANCH DRIVE  LELAND NC 28451  Brunswick","Email":"phylliseshepard2002@yahoo.com","Website":"","Facility/Program Type":"Family Child Care Home","Phone":"9105247429","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000110","Facility Name":"CHILDCARE NETWORK # 85","Address":"802 E LEONARD STREET  SOUTHPORT NC 28461  Brunswick","Email":"cni85@childcarenetwork.com","Website":"www.childcarenetwork.net","Facility/Program Type":"Child Care Center","Phone":"9104570585","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000121","Facility Name":"PRECIOUS HANDS HOME CHILD CARE","Address":"4450 NORTHWEST RD   NE  LELAND NC 28451  Brunswick","Email":"lsbg45@att.net","Website":"","Facility/Program Type":"Family Child Care Home","Phone":"9106559978","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000163","Facility Name":"KIDS WORLD ACADEMY I","Address":"713 CASWELL AVENUE  SOUTHPORT NC 28461  Brunswick","Email":"a.taylor@kidsworldacademyinc.com","Website":"","Facility/Program Type":"Child Care Center","Phone":"9103634612","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000180","Facility Name":"ALL ABOUT KIDS DAYCARE","Address":"925 GREEN LEWIS ROAD  SE  BOLIVIA NC 28422  Brunswick","Email":"allaboutkids@atmc.net","Website":"","Facility/Program Type":"Child Care Center","Phone":"9102539700","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000199","Facility Name":"GREAT BEGINNINGS CHILD DEVELOPMENT CENTER","Address":"1448 RIVER ROAD  WINNABOW NC 28479  Brunswick","Email":"greatbeginningscdc@yahoo.com","Website":"","Facility/Program Type":"Child Care Center","Phone":"9103830047","Enrolled in Subsidized Child Care Program":"Yes"},
// {"License Number":"10000201","Facility Name":"SOUTHEASTERN CHRISTIAN ACADEMY","Address":"19 SW RED BUG ROAD  SHALLOTTE NC 28470  Brunswick","Email":"hhamilton@scashallotte.org","Website":"","Facility/Program Type":"Child Care Center","Phone":"9107542389","Enrolled in Subsidized Child Care Program":"No"},
// {"License Number":"10000216","Facility Name":"SHARON'S CHILD CARE","Address":"115 NE 43RD STREET  OAK ISLAND NC 28465  Brunswick","Email":"sgnapinski@gmail.com","Website":"","Facility/Program Type":"Family Child Care Home","Phone":"9104098095","Enrolled in Subsidized Child Care Program":"Yes"}]