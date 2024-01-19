package utils

import (
	"fmt"
	"math/rand"
	"time"
)

func GenerateData() []string {
	var arr []string

	for i := 0; i < 25; i++ {
		if i == 0 {
			arr = append(arr, GenerateRandomNumber())
			continue
		}
		if arr[i-1] != GenerateRandomNumber() {
			arr = append(arr, GenerateRandomNumber())
		} else {
			i--
		}
	}

	return arr
}

func GenerateRandomNumber() string {
	rand.Seed(time.Now().UnixNano())
	var numb string

	for i := 0; i < 12; i++ {
		randomNumber := rand.Intn(9)
		numb += fmt.Sprintf("%d", randomNumber)
	}

	return "08" + numb
}

