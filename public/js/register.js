var form = document.forms[0]
// console.log()
console.log(form.elements)
var a = document.getElementsByClassName("mass")
// console.log(a[0]);

function namech() {
    var name_value = form.elements['name'].value
    var sty = form.elements['name'].style
    if (name_value === "" || name_value === null) {
        sty.border = "5px solid red"
        a[0].innerHTML = "    name can not empty"
    }
    else {
        sty.border = ""
        a[0].innerHTML = ""

    }
}

function validateDOB() {
    var dob = form.elements['DOB'].value;
    var sty = form.elements['DOB'].style
    console.log(dob)
    var pattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
    if (dob == null || dob == "") {

        sty.border = "5px solid red"
        a[1].innerHTML = "   date of birth can not empty"
    }
    else {
        // return true
        sty.border = ""
        a[1].innerHTML = ""

    }
}
function ValidateEmail() {
    var email = form.elements['email'].value;
    var sty = form.elements['email'].style
    console.log(email)
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        // return (true)
        sty.border = ""
        a[2].innerHTML = ""
    }else{
    sty.border = "5px solid red"
    a[2].innerHTML = "enter valid email"}
}
function ValidateAddress() {
    var address = form.elements['address'].value;
    var sty = form.elements['address'].style
    console.log(email)
    if (address == null || address == '') {
        // return (true)
        sty.border = "5px solid red"
        a[3].innerHTML = "enter valid address"
    } else {
        sty.border = ""
        a[3].innerHTML = ""
    }
}
function ValidMobile() {
    var mobile = form.elements['mobile'].value;
    var sty = form.elements['mobile'].style
    if (mobile == '' || !(mobile.length == 10) || isNaN(mobile)) {
        sty.border = "5px solid red"
        a[4].innerHTML = " invalid mobile number"

    } else {
        sty.border = ""
        a[4].innerHTML = ""
    }
}
// function validPas() {
//     var password = form.elements['password'].value;
//     var sty = form.elements['password'].style;
//     var upperCaseLetters = /[A-Z]/g;
//     var lowerCaseLetters = /[a-z]/g;
//     var numbers = /[0-9]/g;
//     var special = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//     if (numbers.test(password) && upperCaseLetters.test(password) && lowerCaseLetters.test(password) && special.test(password) && password.length > 8) {
//         sty.border = ""
//         a[6].innerHTML = ""
//     } else {
//         sty.border = "5px solid red"
//         a[6].innerHTML = "must contain upper case, lower case, special character and must be more then 8 character"
//     }
// }
///exp

function validPas() {
    // var res;
    var str = form.elements['password'].value;
    var sty = form.elements['password'].style;

    // document.getElementById("t1").value;
    if (str.match(/[a-z]/g) && str.match(
        /[A-Z]/g) && str.match(
            /[0-9]/g) && str.match(
                /[^a-zA-Z\d]/g) && str.length >= 8) {

        sty.border = ""
        a[6].innerHTML = ""

    }
    else {

        // res = "FALSE";
        // document.getElementById("t2").value = res;
        sty.border = "5px solid red"
        a[6].innerHTML = "must contain upper case, lower case, special character and must be more then 8 character"
    }

}

/// exp end





function validConfirmPass() {
    var password = form.elements['password'].value;
    // var sty = form.elements['password'].style;
    var passwordcon = form.elements['password_confirm'].value;
    var sty = form.elements['password_confirm'].style
    if (password === passwordcon) {
        sty.border = ""
        a[7].innerHTML = ""
    } else {
        sty.border = "5px solid red"
        a[7].innerHTML = "password should be match"
    }
}

function conf() {
    var ch = form.elements['agree'].checked;
    if (ch) {
        document.getElementById("ragistration").submit();
        a[8].innerHTML = ""
    }
    else {
        a[8].innerHTML = "please confirm terms and condition"

    }

}
