package auth

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// AppConfig represents the application configuration.
type AppConfig struct {
	GoogleOAuthConfig *oauth2.Config
}

var appConfig *AppConfig

// init initializes the AppConfig at the beginning of the program.
func init() {
	appConfig = loadConfig()
}

// loadConfig loads configuration settings from environment variables.
func loadConfig() *AppConfig {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("error: failed to load the env file")
	}

	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	if clientID == "" || clientSecret == "" {
		panic(errors.New("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing"))
	}

	return &AppConfig{
		GoogleOAuthConfig: &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			Endpoint:     google.Endpoint,
			RedirectURL:  "http://localhost:8082/api/V1/loginCb",
			Scopes: []string{
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/userinfo.profile",
			},
		},
	}
}

// GetConfig returns the initialized AppConfig.
func GetConfig() *AppConfig {
	return appConfig
}

// GetAuthURL returns the OAuth2 authorization URL.
func GetAuthURL() string {

	config := GetConfig().GoogleOAuthConfig

	authURL := config.AuthCodeURL("state")
	return authURL
}

// ExchangeCodeForToken exchanges the authorization code for an OAuth2 token.
func ExchangeCodeForToken(code string) (*oauth2.Token, error) {
	config := GetConfig().GoogleOAuthConfig

	token, err := config.Exchange(context.Background(), code)
	if err != nil {
		return nil, err
	}
	log.Println("passed")

	return token, nil
}

// Result represents the response structure.
type Result struct {
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

// Oauth2Middleware is an Echo middleware for OAuth2 authentication.
func Oauth2Middleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		token, err := ExtractToken(c)
		if err != nil {
			return c.String(http.StatusUnauthorized, "Unauthorized")
		}

		if token.Valid() {
			c.Set("user", token)
			return next(c)
		}

		return c.Redirect(http.StatusTemporaryRedirect, GetAuthURL())
	}
}

// ExtractToken extracts the OAuth2 token from the request header.
func ExtractToken(c echo.Context) (*oauth2.Token, error) {
	tokenString := c.Request().Header.Get("Authorization")
	if tokenString == "" {
		return nil, echo.NewHTTPError(http.StatusUnauthorized, "Missing Authorization header")
	}

	token, err := GetConfig().GoogleOAuthConfig.TokenSource(context.Background(), &oauth2.Token{AccessToken: tokenString}).Token()
	if err != nil {
		return nil, echo.NewHTTPError(http.StatusUnauthorized, "Invalid token")
	}

	return token, nil
}
