//when the page is load
window.onload = inicializar;
var formTrain;
var refTrain;
var CurrentTime;
//var wait;
var tbodyTrain;




function inicializar() {
    formTrain = $("#form-train");
    $(document).on("submit", formTrain, enviarTrainFirebase);
    tbodyTrain = $("#tbodytrain");
    CurrentTime = new Date();
    // wait = 0;

    refTrain = firebase.database().ref().child("Train");

    LoadTrainfromFirebase();

}

function LoadTrainfromFirebase() {

    refTrain.on("value", function(snapshot) {
        tbodyTrain.empty();
        var datas = snapshot.val();
        var rowShow = "";

        // console.log(CurrentTime);

        for (var i in datas) {

            rowShow += "<tr>" +
                "<td>" + datas[i].name + "</td>" +
                "<td>" + datas[i].destination + "</td>" +
                "<td>" + datas[i].frequency + "</td>" +
                //  "<td>" + getNextArrival(datas[i].frequency, datas[i].firstTrainTime) + "</td>" +
                "<td>" + datas[i].name + "</td>" +
                "<td>" +
                "<button class='btn btn-primary borrar' data-train='" + i + "' onclick=updateTrain('" + i + "')>" +
                "<span class='glyphicon glyphicon-pencil'></span>" +
                "</button>" +
                "</td>" +
                "<td>" +
                "<button class='btn btn-danger borrar' data-train='" + i + "' onclick=deleteTrain('" + i + "')>" +
                "<span class='glyphicon glyphicon-trash'></span>" +
                "</button>" +
                "</td>" +
                "</tr>";
        }

        tbodyTrain.append(rowShow);


    });
}

function updateTrain(elementU) {

    var refTrainUpdate = refTrain.child(elementU);
    refTrainUpdate.on("value", function(snapshot) {
        var datos = snapshot.val();
        $("#formDestination").val(datos.destination);
        $("#formTimeFirst").val(datos.firstTrainTime);
        $("#formFrequency").val(datos.frequency);
        $("#formName").val(datos.name);

    });


}

function deleteTrain(elementD) {
    var refTrainDelete = refTrain.child(elementD);
    refTrainDelete.remove();
}

//function get the next train arrival
// function getNextArrival(frequency, firstTrain) {

//     var currentHours = CurrentTime.getHours();
//     var currentMin = CurrentTime.getMinutes();
//     var stringTime = currentHours + ":" + currentMin;

//     //if current time now > first train hour
//     if (stringTime > firstTrain) {
//         currentMin += frequency;
//         stringTime = currentHours + ":" + currentMin;

//     } else {
//         stringTime = firstTrain;

//     }
//     return getHours(stringTime);
// }

//function get format AM/PM
// function getHours(actualHour) {

//     var arraytime = actualHour.split(":");
//     var hour = arraytime[0];
//     var minutes = arraytime[1];
//     var ampm = hour >= 12 ? 'pm' : 'am';
//     hour = hour % 12;
//     hour = hour ? hour : 12; // the hour '0' should be '12'
//     minutes = minutes < 10 ? '0' + minutes : minutes;
//     var strTime = hour + ':' + minutes + ' ' + ampm;
//     return strTime;
// }



function enviarTrainFirebase(event) {
    event.preventDefault();

    var destinationInput = $("#formDestination").val().trim();
    var TimenInput = $("#formTimeFirst").val().trim();
    var frequencyInput = $("#formFrequency").val().trim();
    var nameInput = $("#formName").val().trim();
    console.log(destinationInput);

    refTrain.push({
        destination: destinationInput,
        firstTrainTime: TimenInput,
        frequency: frequencyInput,
        name: nameInput
    });
    formTrain[0].reset();
    // console.log(event.target.formname.value);

}