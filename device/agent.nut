#require "Twilio.class.nut:1.0.0"

local deviceName = "imp";

device.on("alarm", function(accelData) {
    local request = http.post("https://desolate-tor-72564.herokuapp.com/event", { "Content-Type" : "application/json" }, buildRequest(accelData));
    local response = request.sendsync();
    return response;
});

local buildRequest = function(accelData) {
    return {
        device = deviceName
        data = http.jsonencode(accelData)
    }
}