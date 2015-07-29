var MixpanelWrapper = function () {
  var self = {};
  var mixpanelEventCookie = 'mixpanelEventCookie';

  self.track = function (data) {
    $.cookie(mixpanelEventCookie, JSON.stringify(data), {path: '/'});
  };

  self.trackSync = function (data) {
    var eventName = data.eventName;
    var dataToSend = _(data).omit('eventName');
    setGlobalData(dataToSend);
    if (!window.mixpanel) {
      console.log('Mixpanel not available. Skipping tracking of: ' + eventName);
      console.log(dataToSend);
      return;
    }
    mixpanel.track(eventName, dataToSend);
  };

  self.sendDataFromCookie = function () {
    var eventCookie = $.cookie(mixpanelEventCookie);
    if (eventCookie) {
      var eventDetails = $.parseJSON(eventCookie);
      if (eventDetails) {
        self.trackSync(eventDetails);
        $.removeCookie(mixpanelEventCookie, { path: '/' });
      }
    }
  };

  function setGlobalData(data) {
    _.each(['User name', 'Display Name', 'User mixpanel id', 'Repository', 'Branch'], function (dataName) {
      var dataValue = $('meta[name="' + dataName + '"]').attr('content');
      if (dataValue) {
        data[dataName] = dataValue;
      }
    });
  }

  return self;
};

$(function () {
  var data = {eventName: 'Page View', 'Page Name': document.title, 'URL': window.location.pathname};
  if ($('meta[name=positioning-message]').length > 0) {
    data['PositioningMessage'] = $('meta[name=positioning-message]').attr('content');
  }
  MixpanelWrapper().trackSync(data);
});

$(function () {
  function dataFromElement(element) {
    var trackData = {};
    $.each(element.data(), function(k, v) {
      keydata = k.match(/^(mp)(.+)/);
      if (keydata != null && keydata.length == 3 && keydata[1] === "mp") {
        trackData[keydata[2]] = element.data(keydata[0]);
      }
    });

    var legacyTrackData = {
      eventName: element.data('track-click') || element.data('track-click-sync'),
      viaLink: element.data('via-link'),
      user: element.data('user'),
      project: element.data('project'),
      branch: element.data('branch')
    };

    return $.extend({}, legacyTrackData, trackData);
  }

  // we use mousedown because for some reason click event is not bubbled by knockout
  // for stuff that can be sent to the server on synchronously
  $(document).on('mousedown', '[data-track-click-sync]', function() {
    MixpanelWrapper().trackSync(dataFromElement($(this)));
  });

  // we use mousedown because for some reason click event is not bubbled by knockout
  // for stuff that causes the page to reload, we remember what needs to be sent, and send it over.
  $(document).on('mousedown', '[data-track-click]', function() {
    MixpanelWrapper().track(dataFromElement($(this)));
  });

  MixpanelWrapper().sendDataFromCookie();
});
