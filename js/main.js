$(function () {
    // Html elements

    const taskListRow = document.getElementById("takenlijst_tr");
    const taaOmschr  = document.getElementById("taa_omschr").value;
    const newTaskForm = document.getElementById("taken_form")
    const formSubmit = document.getElementById("formsubmit")



    // Functions----------------------------------------------------------

    const renderTaskListFromApiJson = function (data) {
        let tasklist = "";
        for (let i = 0; i < data.data.length; i++) {
            tasklist +=
                "          <tr >\n" +
                "                <td><input id=\"datum_"+ data.data[i].taa_id +"\" type=\"date\" value="+ data.data[i].taa_datum +"></td>\n" +
                "                <td><input id=\"omschr_"+ data.data[i].taa_id +"\" type=\"text\" value="+  JSON.stringify(data.data[i].taa_omschr) +"></td>\n" +
                "                <td><input data-taskid='"+ data.data[i].taa_id + "' type=\"button\" value='update'></td>\n" +
                "                <td ><input data-taskid='"+ data.data[i].taa_id + "' type=\"button\" value=\"delete\"></td>\n" +
                "            </tr>";
        }
        taskListRow.innerHTML = tasklist;
    }

    const ajaxCall = function(url,type,data,datatype,function_for_succes) {
        $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(data),
            // data: data,
            headers: {'Authorization': "Basic " + btoa("username:123")},
               dataType: datatype,
            contentType: "application/json",
            async: true,
            success: function(data) {
                function_for_succes(data)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error")
                alert(thrownError)
            }
        });
    }

    const initTaskList = function () {
        ajaxCall("http://localhost/projects/php2/phpapi/api/taken","GET",false
            ,"json",function (data) {
            renderTaskListFromApiJson(data)

            })
    }

    // event listeners --------------------------------------------------------------------

    // Task list listeners
    taskListRow.addEventListener("click", function(e) {
        const taa_id = e.target.dataset.taskid
        e.preventDefault();
        if(e.target.value === "delete"){
            ajaxCall("http://localhost/projects/php2/phpapi/api/taak/"+ taa_id,"DELETE",false
                ,"json",function (data) {
                    renderTaskListFromApiJson(data)
                })}

        // update via api and get new task list back
        if(e.target.value === "update"){
            // get the inputfields value
            const taskDescr = document.getElementById("omschr_" + taa_id).value ;
            const taskDate =   document.getElementById("datum_" + taa_id).value;
            const data = {"taa_omschr": taskDescr , "taa_datum": taskDate };
            //
            ajaxCall("http://localhost/projects/php2/phpapi/api/taak/" + taa_id,"PUT",data
                ,"json",function (data) {
                    renderTaskListFromApiJson(data)
                })
        }

    });

    // submit form listeners

    formSubmit.addEventListener("click",function (e) {
        const taskDescr = e.target.form.elements["0"].value ;
        const taskDate = e.target.form.elements["1"].value ;
        const data = {"taa_omschr": taskDescr , "taa_datum": taskDate };
        ajaxCall("http://localhost/projects/php2/phpapi/api/taken","POST",data
            ,"json",function (data) {
                renderTaskListFromApiJson(data)
            })

    })
    // init on page load ---------------------------------------------------------------------------------

    initTaskList();

});




