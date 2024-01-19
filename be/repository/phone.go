package repositories

import (
	"be/model"
	"be/utils/helper"
	"encoding/json"
	"log"

	"gorm.io/gorm"
)

type PhonebookRepository interface {
	GetAllphone() (model.GetAllPhonebook, error)
	InsertBulkData(randomData []string) (bool, error)
	DeleteData(deleteData string) (bool, error)
	UpdateData(updateData string) (bool, error)
}

func (r *repository) GetAllphone() (model.GetAllPhonebook, error) {
	pb := model.GetAllPhonebook{}
	var result string

	paramsJSON, err := json.Marshal("")
	if err != nil {
		log.Println("debug1", err)
		return pb, err
	}

	err = r.db.Raw("SELECT * from jagatteknologi.get_all_numbers($1::jsonb)", string(paramsJSON)).Scan(&result).Error
	if err != nil {
		log.Println("debug2", err)
		return pb, err
	}

	err = json.Unmarshal([]byte(result), &pb)
	if err != nil {
		log.Println("Error parsing JSON:", err)
		return pb, err
	}

	return pb, nil
}
func (r *repository) DeleteData(deleteData string) (bool, error) {
	var isSuccess bool
	var result string
	paramsJSON := helper.ToJSON(model.NumberPhone{Id: deleteData})

	err := r.db.Raw("SELECT * from jagatteknologi.delete_number_phone($1::jsonb)", paramsJSON).Scan(&result).Error
	if err != nil {
		log.Println("debug2", err)
		return isSuccess, err
	}

	return true, nil
}
func (r *repository) UpdateData(updateData string) (bool, error) {

	var result string


	err := r.db.Raw("select * from jagatteknologi.update_number_phone($1::jsonb)", updateData).Scan(&result).Error
	if err != nil {
		log.Println("debug2", err)
		return false, err
	}

	return true, nil
}

func (r *repository) InsertBulkData(data []string) (bool, error) {

	var result string
	var isSuccess bool
	paramsJSON := helper.ToJSON(model.InsertData{NumberPhone: data})
	err := r.db.Raw("SELECT * from jagatteknologi.insert_bulk_number_phone($1::jsonb)", paramsJSON).Scan(&result).Error
	if err != nil {
		log.Println("debug2", err)
		return isSuccess, err
	}
	err = json.Unmarshal([]byte(result), &isSuccess)
	if err != nil {
		log.Println("Error parsing JSON:", err)
		return false, err
	}
	if !isSuccess {
		return false, nil
	}
	return isSuccess, nil
}
func RepositoryPhonebook(db *gorm.DB) *repository {
	return &repository{db}
}
