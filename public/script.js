let ImageDetails = [];
let ImageDetailID = 0;

$(function () {
  let SubmitButton = $("#Submit-button");
  let ImageForm = $("#ImageForm");
  SubmitButton.click(function (e) {
    ImageDetails.push({
      "id" : ImageDetailID,
      "title" : $("#TitleOfFile").val(),
      "description" : $("#DescriptionOfFile").val()
    })
    ImageDetailID++;
    $("#ViewFile").addClass("active");
    $("#UploadFile").removeClass("active");
    $("#FileUploadForm").hide();
    $("#UploadedFiles").show();
    $.fn.serializefiles = function () {
      var obj = $(this);

      var form_data = new FormData(this[0]);
      $.each($(obj).find('input[type="file[]"]'), function (i, tag) {
        $.each($(tag)[0].files, function (i, file) {
          form_data.append(tag.name, file);
        });
      });

      var params = $(obj).serializeArray();
      $.each(params, function (i, val) {
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
      success: function (data) {
        console.log("File uploaded");
        $("#UploadingBufferModal").modal("hide");
        getUploadedfile(data);
      },
      error: function (Error) {
        console.log("some error", Error);
      }
    });
  });
});

function getUploadedfile(Hash_Array) {
  console.log(Hash_Array);
  if(Hash_Array.length == ImageDetails.length){
    let ImageDetailIndex = 0;
  for (HashObject of Hash_Array) {
    if(HashObject.hash != "Sample"){
      let Title = ImageDetails[ImageDetailIndex].title;
      let Description = ImageDetails[ImageDetailIndex].description;
      ImageDetailIndex++;
    $("#ImageContainer").append(`
  <div id="${ImageDetailIndex}_Image" class="card mb-2 Product">
              <div class="row no-gutters">
                <div class="col-md-4 image-block">
                  <img id="output" src="https://ipfs.infura.io/ipfs/${HashObject.hash}" class="card-img" />
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
                    <a id="url" href="https://ipfs.infura.io/ipfs/${HashObject.hash}">https://ipfs.infura.io/ipfs/${HashObject.hash}</a>
                    </div>
                  </div>
                </div>
              </div>
          </div>
  `);
    }
  }
  }else{
    let ImageDetailIndex;
    for (HashObject of Hash_Array) {
      ImageDetailIndex = 0;
      ImageDetails.push({
        "id" : ImageDetailIndex,
        "title" : "Workspace",
        "description" : "Workspace"
      })
      if(HashObject.hash != "Sample"){
      $("#ImageContainer").append(`
    <div id="${ImageDetailIndex}_Image" class="card mb-2 Product">
                <div class="row no-gutters">
                  <div class="col-md-4 image-block">
                    <img id="output" src="https://ipfs.infura.io/ipfs/${HashObject.hash}" class="card-img" />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body" style="font-size:25px;">
                      <div style="font-size:25px;">
                        <b>Title :</b> Workspace
                      </div>
                      <br>
                      <div style="font-size:25px;">
                        <b>Description : </b> Workspace
                      </div>
                      <br>
                      <div style="font-size:20px;">
                      <a id="url" href="https://ipfs.infura.io/ipfs/${HashObject.hash}">https://ipfs.infura.io/ipfs/${HashObject.hash}</a>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
    `);
      }
      ImageDetailIndex++;
    }
    ImageDetailID = ImageDetailIndex;
  }
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

$(function () {
  $("#UploadFile").click(function () {
    $("#ViewFile").removeClass("active");
    $("#UploadFile").addClass("active");
    $("#UploadedFiles").hide();
    $("#FileUploadForm").show();
  });
  $("#ViewFile").click(function () {
    $("#ViewFile").addClass("active");
    $("#UploadFile").removeClass("active");
    $("#FileUploadForm").hide();
    $("#UploadedFiles").show();
    $("#DashboardPage").css("background-image","url('./img/2.jpg')");
  });
});

$(function () {
  $.post("api/getMyAccount",
    {
      UserID: 0
    },
    function (Hash_Array) {
      if (Hash_Array) {
        getUploadedfile(Hash_Array);
      }
    })
})

$(function () {
  $("#UploadImageInput").change(function () {
    console.log("Change Detected");
      var filename = $("#UploadImageInput").val();
      if (/^\s*$/.test(filename)) {
          console.log("File not Uploaded");
          $(this).closest('.file-upload').removeClass('active');
          $(this).closest('.file-upload').find('.file-select-name').text("No file chosen");
      } else {
        console.log("File Uploaded");
          if(this.files[0].size/1024/1024 <= 1){
              $(this).closest('.file-upload').addClass('active');
              $(this).closest('.file-upload').find('.file-select-name').text(filename.replace("C:\\fakepath\\", ""));
          }else{
              $(this).val("");
              $(this).closest('.file-upload').removeClass('active');
              $(this).closest('.file-upload').find('.file-select-name').text("No file chosen");
              alert("Size of uploaded document is greater than 1 MB");
          }
      }
  });
})

$(function(){
  $("#ImageSearchBox").keyup(function(){
    console.log("Key up")
    let SearchedValue = $("#ImageSearchBox").val();
      for(Detail of ImageDetails){
        if(parseInt(Detail.title.toUpperCase().indexOf(SearchedValue.toUpperCase())) > -1 ||
        parseInt(Detail.description.toUpperCase().indexOf(SearchedValue.toUpperCase()) >-1 )){
          $(`#${Detail.id}_Image`).show();
        }else{
          $(`#${Detail.id}_Image`).hide();
        }
      }
  })
})