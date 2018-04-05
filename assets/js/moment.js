//when the page is load
window.onload = inicializar;
var formTrain;
var refTrain;
var tbodyTrain;
var ADD = "Add new Train";
var UPDATE = "Update Train";
var modo = ADD;
var refTrainUpdate;



function inicializar() {
    formTrain = $("#form-train");
    $(document).on("submit", formTrain, enviarTrainFirebase);
    tbodyTrain = $("#tbodytrain");

    refTrain = firebase.database().ref().child("Train");

    LoadTrainfromFirebase();

}

function LoadTrainfromFirebase() {

    refTrain.on("value", function(snapshot) {
        tbodyTrain.empty();
        var datas = snapshot.val();
        var rowShow = "";


        for (var i in datas) {
            var tFrequency = datas[i].frequency;

            var firstTimeConverted = moment(datas[i].firstTrainTime, "HH:mm");

            var currentTime = moment();
            //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            // // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            //console.log("DIFFERENCE IN TIME: " + diffTime);

            // // Time apart (remainder)
            var tRemainder = diffTime % tFrequency;
            //console.log(tRemainder);

            // // Minute Until Train
            var tMinutesTillTrain = tFrequency - tRemainder;
            // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

            // // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

            rowShow += "<tr>" +
                "<td>" + datas[i].name + "</td>" +
                "<td>" + datas[i].destination + "</td>" +
                "<td>" + datas[i].frequency + "</td>" +
                "<td>" + moment(nextTrain).format("hh:mm a") + "</td>" +
                "<td>" + tMinutesTillTrain + "</td>" +
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

    refTrainUpdate = refTrain.child(elementU);
    refTrainUpdate.once("value", function(snapshot) {
        var datos = snapshot.val();
        console.log(refTrainUpdate);
        $("#formDestination").val(datos.destination);
        $("#formTimeFirst").val(datos.firstTrainTime);
        $("#formFrequency").val(datos.frequency);
        $("#formName").val(datos.name);
    });
    $("#btn-submit").attr("value", UPDATE);
    modo = UPDATE;

}

function deleteTrain(elementD) {
    var refTrainDelete = refTrain.child(elementD);
    refTrainDelete.remove();
}

function enviarTrainFirebase(event) {
    event.preventDefault();

debugger;
    var destinationInput = $("#formDestination").val().trim();
    var TimenInput = $("#formTimeFirst").val().trim();
    var frequencyInput = $("#formFrequency").val().trim();
    var nameInput = $("#formName").val().trim();
    console.log(destinationInput);

    switch (modo) {
        case ADD:
            refTrain.push({
                destination: destinationInput,
                firstTrainTime: TimenInput,
                frequency: frequencyInput,
                name: nameInput
            });
            break;
        case UPDATE:
            refTrainUpdate.update({
                destination: destinationInput,
                firstTrainTime: TimenInput,
                frequency: frequencyInput,
                name: nameInput
            });
            $("#btn-submit").attr("value", ADD);
            modo=ADD;
            break;
    }
    formTrain[0].reset();
}