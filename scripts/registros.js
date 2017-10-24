function pushRegModal() {
  const modal =
    '<div id="modalRegistros" class="modal fade">\
        <div class="modal-dialog" role="document">\
        <div class="modal-content">\
            <div class="modal-header">\
            <h5 class="modal-title">Registrar</h5>\
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                <span aria-hidden="true">&times;</span>\
            </button>\
            </div>\
            <div class="modal-body">\
            <label for="matricula">Matricula o Numero De Empleado</label>\
            <input type="text" class="form-control" id="matricula" placeholder="Matricula">\
            </div>\
            <div class="modal-footer">\
            <div id="cargando"></div>\
            <button type="button" class="btn btn-primary saveReg">Registrar</button>\
            </div>\
        </div>\
        </div>\
    </div>';

  $("body").append(modal);
}

let wait = false;
$(() => {
  $("body").on("hide.bs.modal", "#modalRegistros", e => {
    $("#matricula").val("");
    $("#cargando").removeClass("cargandoInit");
    $("#statusMessage").remove();
  });

  /* Inserta el modal en el DOM y lo muestra*/

  $(".regForm").click(e => {
    if ($("#modalRegistros").length == 0) {
      pushRegModal();
    }

    let id = e.currentTarget.id;
    $("#modalRegistros").modal("toggle");
    $("#matricula").attr("evento-id", id);
  });

  if (!wait) {
    $("body").on("click", ".saveReg", e => {
      $("#statusMessage").remove();

      wait = true;
      if (!$("#matricula").val() == "") {
        let matricula = $("#matricula").val();
        let eventID = $("#matricula").attr("evento-id");

        $("#cargando").addClass("cargandoInit");

        $(".saveReg").button("toggle");

        let url =
          "http://epsilon.fime.uanl.mx/ServiceAni70/api/Matricula?id=" +
          matricula +
          "&curso=" +
          eventID;
        console.log(url);
        //Post a url (epsilon)

        $.post(url, e => {
          wait = false;
          $("#cargando").removeClass("cargandoInit");
          //200 OK, 500 Internal Server Error, 400 Bad Request
          if (e.code == "200") {
            $("#cargando").append(
              '<a id="statusMessage">' + "Grabado" + "</a>"
            );
          }
          if (e.code == "400") {
            $("#cargando").append(
              '<a id="statusMessage">' +
              "Matricula ya ha sido ingresada o no existe" +
              "</a>"
            );
          }
          if (e.code == "500") {
            $("#cargando").append(
              '<a id="statusMessage">' + "Servidor no habilitado" + "</a>"
            );
          }
        }).fail(e => {
          console.log(e);
        });
      } else {
        // end if matricula
        $("#cargando").append(
          '<a id="statusMessage">ingrese una matricula</a>'
        );
      }
    }); //onClick body
  } //end if
});
