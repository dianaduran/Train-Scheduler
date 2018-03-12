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
            var tFrequency = datas[i].frequency;

            var firstTimeConverted = moment(datas[i].firstTrainTime, "HH:mm");
            // console.log(firstTimeConverted);

            // // Current Time
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

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
                "<td>" + moment(nextTrain).format("hh:mm") + "</td>" +
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

    //     var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
    // starCountRef.on('value', function(snapshot) {
    //   updateStarCount(postElement, snapshot.val());
    // });

    var refTrainUpdate = refTrain.child(elementU);
    refTrainUpdate.once("value", function(snapshot) {
        var datos = snapshot.val();
        console.log(refTrainUpdate);
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