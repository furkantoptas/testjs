(function ($) {
  var count = 5;
  var newConter;
  var counterInterval;
  var archiveId;

  var selector = {
    cameraDescription: ".control-camera .camera-description",
    deviceForm: ".devices .device-form",
    recordingCount: ".control-camera .recording-count",
    recording: ".devices .recording",
    pieProgressNumber: ".control-camera .recording-count .pie-progress-number",
    cameraOverlay: ".control-camera .camera-overlay",
    replayVideo: ".control-camera .replay-video",
    deviceCheckContainer: ".device-check-container",
    systemCheckConfirm: ".system-check-confirm",
    deviceListContainer: ".device-check-container .device-list-container",
    deviceItemContainer: ".device-check-container .device-item-container",
    cameraItem: "#Camera",
    cameraItemContainer: '[data-id="Camera"]',
    microphoneItem: "#Microphone",
    microphoneItemContainer: '[data-id="Microphone"]',
    speakersItem: "#Speakers",
    speakersItemContainer: '[data-id="Speakers"]',
    connectionItem: "#Connection",
    connectionItemContainer: '[data-id="Connection"]',
    startRecordingBtn: "#startRecordingBtn",
    mainContainer: ".main-container",
    videoPublisher: "#publisherParent",
  };

  setTimeout(function () {
    $(selector.cameraItem).removeClass("hidden");
    console.log("ready1!");
  }, 1000);

  setTimeout(function () {
    $(selector.microphoneItem).removeClass("hidden");
    console.log("ready2!");
  }, 1500);

  setTimeout(function () {
    $(selector.speakersItem).removeClass("hidden");
    console.log("ready3!");
  }, 2000);

  setTimeout(function () {
    $(selector.connectionItem).removeClass("hidden");
    console.log("ready4!");
  }, 2500);

  setTimeout(function () {
    $(selector.startRecordingBtn).removeClass("hidden");
    console.log("ready5!");
  }, 3000);

  var events = {
    onStartRecordingButtonClick: function () {
      $(selector.startRecordingBtn).on("click", function () {
        if ($(".text-danger").length > 0 || $(".lds-dual-ring").length > 0)
          return;

        $(selector.deviceCheckContainer).addClass("hidden");
        $(selector.mainContainer).removeClass("hidden");
        startRecording();
      });
    },
    onRecordVideoButtonClick: function () {
      $(".recordVideoBtn").on("click", function () {
        $(selector.cameraDescription).addClass("hidden");
        $(selector.recordingCount).removeClass("hidden");
        $(selector.cameraOverlay).addClass("hidden");
        $(selector.deviceForm).addClass("hidden");
        $(selector.recording).removeClass("hidden");
        $(selector.systemCheckConfirm).addClass("hidden");
        $(selector.replayVideo).addClass("hidden");
        $(selector.videoPublisher).removeClass("hidden");

        $(selector.deviceCheckContainer).removeClass("hidden");
        $(selector.mainContainer).addClass("hidden");
      });
    },
    onDeviceListContainerClick: function () {
      $(".device-list-container > ul >li").on("click", function () {
        var $item = $(this);
        var id = $item.attr("id");
        changePanel(id);
      });
    },

    onConfirmCheckboxClick: function () {
      $("#ConfirmCheckbox").on("click", function () {
        var $el = $(this);
        if ($el.prop("checked")) $("#doneBtn").removeClass("disabled");
        else $("#doneBtn").addClass("disabled");
      });
    },

    onDoneButtonClick: function () {
      $("#doneBtn").on("click", function () {
        $("#vp").data("videoProvider").confirmSystemCheckAsync();
      });
    },
    onBackButtonClick: function () {
      $(".backBtn").on("click", function () {
        $(".device-item").addClass("hidden");
        $(selector.deviceItemContainer).addClass("hidden");
        $(selector.deviceListContainer).removeClass("hidden");
      });
    },
  };

  function changePanel(id) {
    $(".device-item").addClass("hidden");
    $(selector.deviceListContainer).addClass("hidden");
    $(selector.deviceItemContainer).removeClass("hidden");
    $('[data-id="' + id + '"]').removeClass("hidden");
  }

  startRecording = function () {
    $(selector.pieProgressNumber).text("0" + count);
    $(selector.cameraDescription).addClass("hidden");
    $(selector.recordingCount).removeClass("hidden");
    $(selector.cameraOverlay).addClass("hidden");
    $(selector.deviceForm).addClass("hidden");
    $(selector.recording).removeClass("hidden");
    $(selector.systemCheckConfirm).addClass("hidden");
    $(selector.replayVideo).addClass("hidden");
    $(selector.videoPublisher).removeClass("hidden");

    $.ajax({
      url:
        "/analyse/interview/start-test-archive?participantKey=" +
        $("#vp").data("videoProvider").key,
      type: "GET",
      success: function (data) {
        archiveId = data.archiveId;

        stopRecording();
      },
    });
    setTimeout(function () {
      newConter = count;
      percent = 100;
      counterInterval = setInterval(function () {
        if (newConter <= 0) {
          clearInterval(counterInterval);
        }

        $(selector.pieProgressNumber).text("0" + newConter);
        percent = (newConter * 100) / 5;
        if (percent != 100)
          $(".recording-count .pie-progress").asPieProgress(
            "go",
            percent + "%"
          );
        newConter--;
      }, 1000);
    }, 2000);
  };

  stopRecording = function () {
    $(selector.recordingCount).addClass("hidden");
    $(selector.recording).addClass("hidden");
    $(selector.pieProgressNumber).text("0" + count);
    $(selector.replayVideo).removeClass("hidden");
    $(selector.systemCheckConfirm).removeClass("hidden");
    $(selector.videoPublisher).addClass("hidden");
    $("#ConfirmCheckbox").prop("disabled", true);
    setTimeout(function () {
      $(".recording-count .pie-progress").asPieProgress("go", "100%");
    }, 500);

    var provider = $("#vp").data("videoProvider").providerName;

    setTimeout(function () {
      $.ajax({
        url:
          "/analyse/interview/download-" +
          provider +
          "-archive?archiveId=" +
          archiveId,
        type: "GET",
        success: function (data) {
          $("#videoPlayer").attr("src", data.url);
        },
      });
    }, 3000);
  };

  videoPlayed = function () {
    $("#ConfirmCheckbox").prop("disabled", false);
  };

  $(".recording-count .pie-progress").asPieProgress({
    namespace: "",
    min: 0,
    max: 100,
    goal: 100,
    size: 160,
    speed: 15,
    barcolor: "#fff",
    barsize: "4",
    trackcolor: "rgba(255,255,255,.1)",
    fillcolor: "none",
  });

  function getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  var inits = {
    initChangePanel: function (id) {
      changePanel(id);
    },
    initStartRecording: function () {
      startRecording();
    },
    initStopRecording: function () {
      stopRecording();
    },
    initVideoPlayed: function () {
      videoPlayed();
    },
  };

  (function () {
    inits.each((init) => {
      inits[init]();
    });
  })();
})(jQuery);
