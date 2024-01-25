package utils

import (
	"encoding/base64"
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

func GenerateRandomToken(length int) (string, error) {
	// Determine the size of the byte slice needed for the given length
	byteLength := (length * 3) / 4
	if length%4 != 0 {
		byteLength++
	}

	// Generate random bytes
	randomBytes := make([]byte, byteLength)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}

	// Encode the random bytes to base64
	token := base64.URLEncoding.EncodeToString(randomBytes)

	// Trim any padding '=' characters
	token = token[:length]

	return token, nil
}


