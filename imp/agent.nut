local deviceName = "imp";

device.on("alarm", function(accelData) {
	local request = http.post("https://desolate-tor-72564.herokuapp.com/event", { "Content-Type" : "application/json" }, buildRequestString(accelData));
	local response = request.sendsync();
	return response;
});

function buildRequestString(accelData) {
	local table = {
		device = deviceName
		data = http.jsonencode(accelData)
	}
	return http.jsonencode(table);
}