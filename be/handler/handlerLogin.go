package handlers

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"

	auth "be/utils/auth"
)

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
