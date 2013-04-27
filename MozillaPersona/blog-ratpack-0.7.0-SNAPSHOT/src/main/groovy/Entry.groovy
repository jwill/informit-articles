class Entry {
	String key
	String title
	String dateCreated = new Date()
	String content
}

class Comment {
	String key
	String entryId
	String author
	String content
	String dateCreated
}
