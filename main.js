'use strict';

$(document).ready(function() {
    $('#app-status-ul').append('<li>Holla !</li>');

    // result contains any message sent from the plugin call
    function successHandler(result) {
        $('#app-status-ul').append('<li>[successHandler] ' + result + '</li>');
    }

    // result contains any error description text returned from the plugin call
    function errorHandler(error) {
        $('#app-status-ul').append('<li>[errorHandler] ' + error + '</li>');
    }

    // Android and Amazon Fire OS
    window.onNotification = function (e) {
        $('#app-status-ul').append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

        switch (e.event) {
            $('#app-status-ul').append('<li>--MSG '+ e +'--</li>');
            case 'registered':
                if (e.regid.length > 0) {
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    $('#app-status-ul').append('<li>REGISTERED -> REGID:' + e.regid + '</li>');
                }
                break;

            case 'message':
                window.e = e;
                $('#app-status-ul').append('<li>--MSG '+JSON.stringify(e.payload) +'--</li>');
                $('#app-status-ul').append('<li>--MSG '+JSON.stringify(e) +'--</li>');
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                // if (e.foreground) {
                //     $('#app-status-ul').append('<li>--INLINE NOTIFICATION--</li>');

                //     // on Android soundname is outside the payload.
                //     // On Amazon FireOS all custom attributes are contained within payload
                //     var soundfile = e.soundname || e.payload.sound;
                //     // if the notification contains a soundname, play it.
                //     var my_media = new Media('/android_asset/www/' + soundfile);
                //     my_media.play();
                // } else { // otherwise we were launched because the user touched a notification in the notification tray.
                //     if (e.coldstart) {
                //         $('#app-status-ul').append('<li>--COLDSTART NOTIFICATION--</li>');
                //     } else {
                //         $('#app-status-ul').append('<li>--BACKGROUND NOTIFICATION--</li>');
                //     }
                // }

                // $('#app-status-ul').append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                // //Only works for GCM
                // $('#app-status-ul').append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                // //Only works on Amazon Fire OS
                // $('#app-status-ul').append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
                break;

            case 'error':
                //$('#app-status-ul').append('<li>ERROR -> MSG:' + e.msg + '</li>');
                break;

            default:
                //$('#app-status-ul').append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                break;
        }
    }

    $('#button').on('click', function() {
        window.pushNotification.register(successHandler, errorHandler, {
            'senderID': '370001790729',
            'ecb': 'onNotification'
        });
    });


    // Wait for device API libraries to load
    document.addEventListener('deviceready', function() {
        // push notification
        window.pushNotification = window.plugins.pushNotification;
        $('#app-status-ul').append('<li> device.platform ' + device.platform + '</li>');

        if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos') {
            window.pushNotification.register(successHandler, errorHandler, {
                'senderID': '370001790729',
                'ecb': 'onNotification'
            });
        } else if (device.platform == 'blackberry10') {
            //     window.pushNotification.register(successHandler, errorHandler, {
            //         invokeTargetId: 'replace_with_invoke_target_id',
            //         appId: 'replace_with_app_id',
            //         ppgUrl: 'replace_with_ppg_url', //remove for BES pushes
            //         ecb: 'pushNotificationHandler',
            //         simChangeCallback: replace_with_simChange_callback,
            //         pushTransportReadyCallback: replace_with_pushTransportReady_callback,
            //         launchApplicationOnPush: true
            //     });
        } else {
            window.pushNotification.register(tokenHandler, errorHandler, {
                'badge': 'true',
                'sound': 'true',
                'alert': 'true',
                'ecb': 'onNotificationAPN'
            });
        }
    }, false);

});