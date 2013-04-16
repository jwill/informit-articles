class AuthHelper {
	static doAuth = {app ->
		def handler = { req ->
    	def authHeader = req.getHeader("Authorization")
    	def encodedValue = authHeader.split(" ")[1]
    	def decodedValue = new String(encodedValue.decodeBase64())?.split(":")
    	// do some sort of validation here
    	if (decodedValue[0] == "") {
    		return "Unauthorized"
    	} else {
    		decodedValue
    	}
    }
    app.metaClass.doAuth = handler;
  }
}
