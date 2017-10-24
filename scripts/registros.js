function pushRegModal() {
  const modal =
    '<div class="modal fade" id="modalRegistros" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
    <div class="modal-dialog" role="document">\
      <div class="modal-content">\
        <div class="modal-header">\
          <h5 class="modal-title" id="exampleModalLabel">New message</h5>\
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
            <span aria-hidden="true">&times;</span>\
          </button>\
        </div>\
        <div class="modal-body">\
          <form>\
            <div class="form-group">\
              <label for="Nombre" class="col-form-label">Nombre:</label>\
              <input type="text" class="form-control" id="Nombre">\
            </div>\
            <div class="form-group">\
            <label for="Corre" class="col-form-label">Correo:</label>\
            <input type="text" class="form-control" id="Correo">\
          </div>\
          <div class="form-group">\
          <label for="Institucion" class="col-form-label">Institucion:</label>\
          <input type="text" class="form-control" id="Institucion">\
        </div>\
        <div class="form-group">\
        <p>Indique a que pertenece(Escuela,Industria,Profesor)</p>\
        <label for="Dependencia" class="col-form-label">Indique cual:</label>\
        <input type="text" class="form-control" id="Dependencia">\
      </div>\
          </form>\
        </div>\
        <div class="modal-footer">\
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>\
          <button type="button" class="btn btn-primary">Enviar</button>\
        </div>\
      </div>\
    </div>\
  </div>';

  $("body").append(modal);
}

let wait = false;
$(() => {
  $("body").on("hide.bs.modal", "#modalRegistros", e => {
    $("#Nombre").val("");
    $("#Correo").val("");
    $("#Institucion").val("");
    $("#Dependencia").val("");
    $("#cargando").removeClass("cargandoInit");
    $("#statusMessage").remove();
  });

  /* Inserta el modal en el DOM y lo muestra*/

  $(".registro").click(e => {
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
