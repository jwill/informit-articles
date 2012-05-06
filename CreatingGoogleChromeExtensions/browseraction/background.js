function notify(msg) {
		var notification = webkitNotifications.createNotification(
			"",
			"Note Status.",
			msg
		);
		notification.show();
		window.setTimeout(function() {notification.cancel();}, 5000);
}
