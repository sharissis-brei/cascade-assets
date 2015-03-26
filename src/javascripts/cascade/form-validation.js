<!--
  //this copy of js file from _chapman_common
  
    //added so can replace (dynamically when page is viewed in browser) with domain of server that webpage is being viewed on. will put V_HTTP_HOST in redirect_url field in hidden form field:
    $( document ).ready(function() {
        var elements = document.getElementsByName("redirect_url");
        for (var i = 0; i < elements.length; i++){
            var old_value = elements[i].value;
            var new_value = old_value.replace("V_HTTP_HOST", document.location.host);
            elements[i].value = new_value;
        }
    });


    // used to validate radio button collection (tests if at least 1 is checked):
    function checkRadioSelected (obj) 
    {           
        for (i=0, n=obj.length; i<n; i++) 
        {
            if (obj[i].checked) 
            {
                //var checkvalue = obj[i].value;
                return true;
                break;
            }
        }
    }


    //used to validate drop-down list boxes:
    function ChkSelected(fld,fldNam)
    {
        if (fld.selectedIndex == -1 || fld.value=="") 
        {   alert (fldNam + " is required. Please select one");
            fld.focus();
            return false;
        }
        else return true;
    }

    //used to validate check boxes:
    function ChkBoxChecked(fld,fldNam)
    {   
        var checkbox_choices = 0;
        
        //Loop from zero to the one minus the number of checkbox button selections
        
        for (counter = 0; counter < fld.length; counter++)
        {   
            // If a checkbox has been selected it will return true, otherwise false
            if (fld[counter].checked)
            {
                checkbox_choices = checkbox_choices + 1; 
            }
        }
        
        if (checkbox_choices == 0) 
        {   alert (fldNam + " is required. Please check at least one");
            //fld[0].focus();
            return false;
        }
        else return true;
    }

    function SingleChkBoxChecked(fld,fldNam)
    {   
    
            // If a checkbox has been selected it will return true, otherwise false
            if (fld.checked != true) {  
                alert (fldNam + " is required.");
                return false;
            }
            else return true;
    }

    
    //used to validate text boxes:
    function ChkLength(fld,minAllowed,fldNam,ReqdFlag) {
                //alert("fld: " + fld);
                //alert("minAllowed: " + minAllowed);
                //alert("fldNam: " + fldNam);
                //alert(".value: " + fld.value);
                //alert(".value.length: " + fld.value.length);
               if (ReqdFlag == "y" && fld.value.length == 0)
                {
                            window.alert(fldNam + " is required.");
                            fld.focus();
                        return false;
                }
 
                else if (ReqdFlag == "y" && fld.value.length < minAllowed)
                {
                            window.alert(fldNam + " should be at least " + minAllowed + " characters");
                            fld.focus();
                        return false;
                }
               
                else if (fld.value.length < minAllowed && fld.value.length > 1)
                {
                        window.alert(fldNam + " should be at least " + minAllowed + " characters");
                        fld.focus();
                        return false;
                }
              
                else return true;
    }
    
// general purpose function to see if an input value has been entered at all
    function isEmpty(inputStr) {
        if ((inputStr == null) || (inputStr == "")) {
            return true;
        }
        return false;
    }
//general purpose function to see if a suspected number is a number, (only positive number)
    function isNumber(inputVal) {
        
        for (var i=0; i < inputVal.length; i++) {
            var oneChar = inputVal.charAt(i);
            if ((oneChar < "0") || (oneChar > "9")) {
                return false;
            }
        }
        return true;
    }
    
//general purpose function to see if a suspected number is a positive integer
    function isInteger(inputVal) {
        inputStr = inputVal.toString();
        for (var i=0; i < inputStr.length; i++) {
            var oneChar = inputStr.charAt(i);
            if ((oneChar < "0") || (oneChar > "9")) {
                return false;
            }
        }
        return true;
    }
 
// THIS ONE DOESN'T SEEM TO WORK -- USE checkEmail function which follows this one instead:
    function validEmail(v_string) {
            var v_cnt=0;
            inputStr = v_string.toString();
            if (inputStr != null) {
                    for (i = 0; i < inputStr.length; i++) {
                            v_char = inputStr.substring(i, i+1);
                            if (v_char == "@" || v_char == ".") 
                            v_cnt = v_cnt + 1;
                    }
            }
            //  if (v_string.length == 0 || v_cnt >= 2) {
            if (inputStr == null || inputStr.length == 0 || v_cnt >= 2) { 
                        return true; 
        }
            else  {
            //alert("v_cnt: " + v_cnt + " inputStr.length: " + inputStr.length);
            return false; 
        }
    }
    
    <!-- This script and many more are available free online at -->
<!-- The JavaScript Source. http://javascript.internet.com -->

<!-- Begin
function checkEmail_OLD(frmFld) {
if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(frmFld.value)){
return (true)
}
alert("Invalid E-mail Address. Please re-enter.")
return (false)
}
//  End -->

<!-- Begin (9/21/12 added trimmed_email to remove leading and trailing spaces)
function checkEmail(frmFld) {
var trimmed_email = frmFld.value.replace(/^\s+|\s+$/g,"");
if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(trimmed_email)){
return (true)
}
alert("Invalid e-mail Address. Please re-enter.")
return (false)
}
//  End -->


<!-- These DATE VALIDATION scripts and many more are available free online at -->
<!-- The JavaScript Source. http://javascript.internet.com -->

//  Beginning of Date Validaton routines 
function checkdate(objName,fldNam) {
var datefield = objName;
if (chkdate(objName) == false) {
datefield.select();
alert(fldNam + " is not a valid date");
datefield.focus();
return false;
}
else {
return true;
   }
}
function chkdate(objName) {
var strDatestyle = "US"; //United States date style
//var strDatestyle = "EU";  //European date style
var strDate;
var strDateArray;
var strDay;
var strMonth;
var strYear;
var intday;
var intMonth;
var intYear;
var booFound = false;
var datefield = objName;
var strSeparatorArray = new Array("-"," ","/",".");
var intElementNr;
var err = 0;
var strMonthArray = new Array(12);
strMonthArray[0] = "Jan";
strMonthArray[1] = "Feb";
strMonthArray[2] = "Mar";
strMonthArray[3] = "Apr";
strMonthArray[4] = "May";
strMonthArray[5] = "Jun";
strMonthArray[6] = "Jul";
strMonthArray[7] = "Aug";
strMonthArray[8] = "Sep";
strMonthArray[9] = "Oct";
strMonthArray[10] = "Nov";
strMonthArray[11] = "Dec";
strDate = datefield.value;
if (strDate.length < 1) {
return true;
}
for (intElementNr = 0; intElementNr < strSeparatorArray.length; intElementNr++) {
if (strDate.indexOf(strSeparatorArray[intElementNr]) != -1) {
strDateArray = strDate.split(strSeparatorArray[intElementNr]);
if (strDateArray.length != 3) {
err = 1;
return false;
}
else {
strDay = strDateArray[0];
strMonth = strDateArray[1];
strYear = strDateArray[2];
}
booFound = true;
   }
}
if (booFound == false) {
if (strDate.length>5) {
strDay = strDate.substr(0, 2);
strMonth = strDate.substr(2, 2);
strYear = strDate.substr(4);
   }
}
if (strYear.length == 2) {
strYear = '20' + strYear;
}
// US style
if (strDatestyle == "US") {
strTemp = strDay;
strDay = strMonth;
strMonth = strTemp;
}
intday = parseInt(strDay, 10);
if (isNaN(intday)) {
err = 2;
return false;
}
intMonth = parseInt(strMonth, 10);
if (isNaN(intMonth)) {
for (i = 0;i<12;i++) {
if (strMonth.toUpperCase() == strMonthArray[i].toUpperCase()) {
intMonth = i+1;
strMonth = strMonthArray[i];
i = 12;
   }
}
if (isNaN(intMonth)) {
err = 3;
return false;
   }
}
intYear = parseInt(strYear, 10);
if (isNaN(intYear)) {
err = 4;
return false;
}
if (intMonth>12 || intMonth<1) {
err = 5;
return false;
}
if ((intMonth == 1 || intMonth == 3 || intMonth == 5 || intMonth == 7 || intMonth == 8 || intMonth == 10 || intMonth == 12) && (intday > 31 || intday < 1)) {
err = 6;
return false;
}
if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intday > 30 || intday < 1)) {
err = 7;
return false;
}
if (intMonth == 2) {
if (intday < 1) {
err = 8;
return false;
}
if (LeapYear(intYear) == true) {
if (intday > 29) {
err = 9;
return false;
}
}
else {
if (intday > 28) {
err = 10;
return false;
}
}
}
if (strDatestyle == "US") {
//datefield.value = strMonthArray[intMonth-1] + " " + intday+" " + strYear;
datefield.value = intMonth + "/" + intday +"/" + strYear;
}
else {
//datefield.value = intday + " " + strMonthArray[intMonth-1] + " " + strYear;
datefield.value = intday + "/" + intMonth + "/" + strYear;
}
return true;
}
function LeapYear(intYear) {
if (intYear % 100 == 0) {
if (intYear % 400 == 0) { return true; }
}
else {
if ((intYear % 4) == 0) { return true; }
}
return false;
}
function doDateCheck(from, to) {
if (Date.parse(from.value) <= Date.parse(to.value)) {
alert("The dates are valid.");
}
else {
if (from.value == "" || to.value == "") 
alert("Both dates must be entered.");
else 
alert("To date must occur after the from date.");
   }
}
//  End of Date Validaton routines 


//-->
