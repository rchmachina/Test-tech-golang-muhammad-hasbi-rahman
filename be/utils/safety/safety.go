package safety

import (
	"crypto/aes"
	"crypto/cipher"
	//"crypto/rand"
	"encoding/hex"
	"fmt"
	//"io"
	"log"
	"strings"

	"os"
)

func EncryptMessage(message string) (string, error) {
	keyHex, ivHex, err := getKey()
	if err != nil {
		return "", err
	}

	key, err := hex.DecodeString(keyHex)
	if err != nil {
		log.Println("debug1", err)
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		log.Println("debug1", err)
		return "", err
	}

	iv, err := hex.DecodeString(ivHex)
	if err != nil {
		log.Println("debug1", err)
		return "", err
	}

	
	blockSize := block.BlockSize()
	padSize := blockSize - len(message)%blockSize
	message = fmt.Sprintf("%s%s", message, strings.Repeat(string(padSize), padSize))

	mode := cipher.NewCBCEncrypter(block, iv)

	encrypted := make([]byte, len(message))
	mode.CryptBlocks(encrypted, []byte(message))

	return hex.EncodeToString(encrypted), nil
}

func DecryptMessage(ciphertextHex string) (string, error) {
	keyHex, ivHex, err := getKey()
	if err != nil {
		return "", err
	}

	key, err := hex.DecodeString(keyHex)
	if err != nil {
		return "", err
	}
	ciphertext, err := hex.DecodeString(ciphertextHex)
	if err != nil {
		return "", err
	}

	iv, err := hex.DecodeString(ivHex)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	mode := cipher.NewCBCDecrypter(block, iv)
	plaintext := make([]byte, len(ciphertext))
	mode.CryptBlocks(plaintext, ciphertext)

	unpaddedMessage, err := pkcs7Unpad(plaintext)
	if err != nil {
		return "", err
	}

	return string(unpaddedMessage), nil
}

func pkcs7Unpad(data []byte) ([]byte, error) {
	length := len(data)
	if length == 0 {
		return nil, fmt.Errorf("Invalid padding: empty slice")
	}

	unpadding := int(data[length-1])
	if unpadding > length {
		return nil, fmt.Errorf("Invalid padding")
	}

	return data[:(length - unpadding)], nil
}

func getKey() (string, string, error) {
	// Load environment variables
	keyHex := os.Getenv("CIPHER")
	ivHex := os.Getenv("IVKEY")


	return keyHex, ivHex, nil
}
