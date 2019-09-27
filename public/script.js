$(function() {
  let SubmitButton = $("#Submit-button");
  let ImageForm = $("#ImageForm");
  SubmitButton.click(function(e) {
    $("#ViewFile").addClass("active");
    $("#UploadFile").removeClass("active");
    $("#FileUploadForm").hide();
    $("#UploadedFiles").show();
    $.fn.serializefiles = function() {
      var obj = $(this);

      var form_data = new FormData(this[0]);
      $.each($(obj).find('input[type="file[]"]'), function(i, tag) {
        $.each($(tag)[0].files, function(i, file) {
          form_data.append(tag.name, file);
        });
      });

      var params = $(obj).serializeArray();
      $.each(params, function(i, val) {
        form_data.append(val.name, val.value);
      });

      return form_data;
    };

    e.preventDefault();
    $("#UploadingBufferModal").modal("show");
    $.ajax({
      type: "POST",
      url: "/api/upload",
      data: ImageForm.serializefiles(),
      processData: false,
      contentType: false,
      success: function(Hash) {
        getUploadedfile(Hash);
      },
      error: function(Error) {
        console.log("some error", Error);
      }
    });
  });
});

function getUploadedfile(Hash) {
  $("#UploadingBufferModal").modal("hide");
  let Title = $("#TitleOfFile").val();
  let Description = $("#DescriptionOfFile").val();
  $("#ImageContainer").append(`
  <div class="card mb-2 Product">
              <div class="row no-gutters">
                <div class="col-md-4 image-block">
                  <img id="output" src="https://ipfs.infura.io/ipfs/${Hash}" class="card-img" />
                </div>
                <div class="col-md-8">
                  <div class="card-body" style="font-size:25px;">
                    <div style="font-size:25px;">
                      <b>Title :</b> ${Title}
                    </div>
                    <br>
                    <div style="font-size:25px;">
                      <b>Description : </b> ${Description}
                    </div>
                    <br>
                    <div style="font-size:20px;">
                    <a id="url" href="https://ipfs.infura.io/ipfs/${Hash}">https://ipfs.infura.io/ipfs/${Hash}</a>
                    </div>
                  </div>
                </div>
              </div>
          </div>
  `);
}

// $(function() {
//   $.get("/api/getUploadedfile", Hash => {
//     if (Hash) {
//       let url = `https://ipfs.infura.io/ipfs/${Hash}`;
//       document.getElementById("url").innerHTML = url;
//       document.getElementById("url").href = url;
//       document.getElementById("output").src = url;
//     }
//   });
// });

$(function() {
  $("#UploadFile").click(function() {
    $("#ViewFile").removeClass("active");
    $("#UploadFile").addClass("active");
    $("#UploadedFiles").hide();
    $("#FileUploadForm").show();
  });
  $("#ViewFile").click(function() {
    $("#ViewFile").addClass("active");
    $("#UploadFile").removeClass("active");
    $("#FileUploadForm").hide();
    $("#UploadedFiles").show();
  });
});
