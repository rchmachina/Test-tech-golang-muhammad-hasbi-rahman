package model

type GetAllPhonebook []struct {
	Id          string `json:"id"`
	NumberPhone string `json:"numberPhone"`
}
type Encrypted struct {
	EncryptMessage string `json:"encryptedMessage"`
}

type NumberPhone struct {
	Id          string `json:"id"`
	NumberPhone string `json:"numberPhone"`
}
type InsertData struct {
	IsValid     string   `json:"isValid"`
	NumberPhone []string `json:"numberPhone"`
}
type UpdateData struct {
	Id          string `json:"id"`
	NumberPhone string `json:"numberPhone"`
}