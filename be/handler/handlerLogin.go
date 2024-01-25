package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"

	"be/model"
	"be/utils"
	auth "be/utils/auth"
	"be/utils/helper"
)

func LoginNonOauth(c echo.Context) error {

	user := new(model.LoginUser)
	if err := c.Bind(user); err != nil {
		fmt.Println(err)
		return helper.JSONResponse(c, 400, err.Error())
	}
	log.Println("pass")
	log.Println("user login:", user)
	token, err := utils.GenerateRandomToken(32)

	if err != nil {
		return helper.JSONResponse(c, 400, err.Error())
	}

	redirectURL := fmt.Sprintf("http://localhost:5173/redirecting?tokenNonAuth=%s", token)

	// Respond with JSON including the redirect URL
	response := map[string]string{"redirectUrl": redirectURL}
	return c.JSON(http.StatusOK, response)

}
func GoogleLogin(c echo.Context) error {
	authURL := auth.GetAuthURL()
	return c.Redirect(http.StatusTemporaryRedirect, authURL)

}

func GoogleCallback(c echo.Context) error {
	code := c.QueryParam("code")
	token, err := auth.ExchangeCodeForToken(code)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to exchange code for token")
	}

	// Construct the redirect URL with the token information as a query parameter
	redirectURL := fmt.Sprintf("http://localhost:5173/redirecting?accessToken=%s", token.AccessToken)

	cookie := &http.Cookie{
		Name:     "cookiesAuth",
		Value:    token.AccessToken,
		HttpOnly: true,
		MaxAge:   3600, // Cookie expiration time in seconds (1 hour in this example)
	}

	c.SetCookie(cookie)

	// Redirect with the constructed URL
	return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}
