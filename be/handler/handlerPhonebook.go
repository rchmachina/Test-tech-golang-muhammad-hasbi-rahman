package handlers

import (
	//"be/model"
	"be/model"
	repositories "be/repository"
	"be/utils"
	"be/utils/helper"
	"be/utils/safety"
	"fmt"
	"log"

	"github.com/labstack/echo/v4"
)

type phonebookHandler struct {
	phonebookRepository repositories.PhonebookRepository
}

func PhonebookHandler(phonebookRepository repositories.PhonebookRepository) *phonebookHandler {
	return &phonebookHandler{phonebookRepository}
}

func (p *phonebookHandler) PostPhonebook(c echo.Context) error {

	createPhonebook := new(model.Encrypted)
	if err := c.Bind(createPhonebook); err != nil {
		fmt.Println(err)
		return helper.JSONResponse(c, 400, err.Error())
	}

	log.Println(createPhonebook)
	decrypted, err := safety.DecryptMessage(createPhonebook.EncryptMessage)
	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}
	var numberPhone = [1]string{decrypted}

	isSuccess, err := p.phonebookRepository.InsertBulkData(numberPhone[:])
	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}
	if !isSuccess {
		return helper.JSONResponse(c, 400, "number phone already exist")
	}
	result := fmt.Sprintf("success adding number %s ", numberPhone)
	return helper.JSONResponse(c, 200, result)
}

func (p *phonebookHandler) DeleteData(c echo.Context) error {

	deletePb := new(model.Encrypted)
	if err := c.Bind(deletePb); err != nil {
		fmt.Println(err)
		return helper.JSONResponse(c, 400, err.Error())
	}
	log.Println("pass")
	log.Println(deletePb)
	decrypted, err := safety.DecryptMessage(deletePb.EncryptMessage)
	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}

	log.Println("passed", decrypted)
	_, err = p.phonebookRepository.DeleteData(decrypted)
	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}

	return helper.JSONResponse(c, 200, "success")
}


func (p *phonebookHandler) UpdateData(c echo.Context) error {

	encryptedData := new(model.Encrypted)
	if err := c.Bind(encryptedData); err != nil {
		fmt.Println(err)
		return helper.JSONResponse(c, 400, err.Error())
	}

	decrypted, err := safety.DecryptMessage(encryptedData.EncryptMessage)
	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}

	
	

	_, err = p.phonebookRepository.UpdateData(decrypted)
	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}

	return helper.JSONResponse(c, 200, "success")
}
func (p *phonebookHandler) GetPhonebook(c echo.Context) error {

	allData, err := p.phonebookRepository.GetAllphone()
	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}

	stringify := helper.ToJSON(allData)

	res, err := safety.EncryptMessage(stringify)
	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}

	return helper.JSONResponse(c, 200, res)
}

func (p *phonebookHandler) BulkData(c echo.Context) error {

	insertBulk := new(model.InsertData)
	if err := c.Bind(insertBulk); err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}

	decrypted, err := safety.DecryptMessage(insertBulk.IsValid)
	if err != nil {
		log.Println(err)
		return helper.JSONResponse(c, 400, err.Error())
	}
	log.Println("decrypted", decrypted)
	if decrypted == "true" {

		for {
			randomData := utils.GenerateData()

			success, err := p.phonebookRepository.InsertBulkData(randomData)
			if err == nil && success {
				log.Println(success, err)
				break
			} else {
				log.Println(success, err)
			}
		}

	}
	return helper.JSONResponse(c, 200, decrypted)
}
